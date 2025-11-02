import React, { useState, useEffect, useRef } from "react";
import {
    SandpackLayout,
    SandpackProvider,
    SandpackPreview,
    SandpackConsole,
} from "@codesandbox/sandpack-react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ files, currentFile, setFiles }) {
    const [showConsole, setShowConsole] = useState(false);

    const isFolderPath = (path) => {
        if (!path) return false;
        const parts = path.split("/").filter(Boolean);
        let node = files;
        for (const part of parts) {
            if (!node || typeof node !== "object") return false;
            node = node[part];
        }
        return typeof node === "object" && !Array.isArray(node);
    };

    const flattenFiles = (tree, parent = "") => {
        let result = {};
        for (const key in tree) {
            const path = `${parent}/${key}`.replace(/\/+/g, "/");
            if (typeof tree[key] === "object") {
                result = { ...result, ...flattenFiles(tree[key], path) };
            } else {
                result[path.startsWith("/") ? path : `/${path}`] = tree[key];
            }
        }
        return result;
    };

    const getFileContent = (path) => {
        const parts = path.split("/").filter(Boolean);
        let node = files;
        for (const part of parts) {
            if (!node || typeof node !== "object") return "";
            node = node[part];
        }
        return typeof node === "string" ? node : "";
    };

    const handleCodeChange = (newCode) => {
        if (!currentFile || isFolderPath(currentFile)) return;

        setFiles((prev) => {
            const newFiles = JSON.parse(JSON.stringify(prev));
            const parts = currentFile.split("/").filter(Boolean);
            const fileName = parts.pop();
            let node = newFiles;

            for (const p of parts) {
                if (!node[p] || typeof node[p] !== "object") node[p] = {};
                node = node[p];
            }

            node[fileName] = newCode;
            return newFiles;
        });
    };

    if (!currentFile) {
        return (
            <div style={{ color: "#ccc", padding: 20 }}>Select a file to edit</div>
        );
    }

    const flattened = flattenFiles(files);
    const content = getFileContent(currentFile);



    return (
        <div style={{ height: "100vh", backgroundColor: "#011627" }}>
            <SandpackProvider
                files={flattened}
                template="react"
                theme="dark"
                options={{
                    activeFile:
                        currentFile && !isFolderPath(currentFile)
                            ? `/${currentFile}`
                            : "/App.js",
                    showLineNumbers: true,
                }}
            >
                <SandpackLayout
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        height: "100vh",
                        gap: "20px",
                        backgroundColor: "#011627",
                    }}
                >
                    {/* Left Column — Monaco Editor */}
                    <div style={{ height: "100%", overflow: "hidden" }}>
                        {!isFolderPath(currentFile) ? (
                            <Editor
                                key={currentFile}
                                language="javascript"
                                theme="vs-dark"
                                value={content}
                                onChange={handleCodeChange}
                                height="100%"
                                width="100%"
                                options={{
                                    fontSize: 14,
                                    automaticLayout: true,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    wordWrap: "on",
                                }}
                            />
                        ) : null}

                    </div>

                    {/* Right Column — Preview + Console */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            overflow: "hidden",
                            backgroundColor: "#011627",
                            borderLeft: "1px solid #1d2333",
                            position: "relative",
                        }}
                    >
                        <button
                            onClick={() => setShowConsole(!showConsole)}
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "10px",
                                zIndex: 10,
                                background: "#1d2333",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "13px",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => (e.target.style.background = "#2b3245")}
                            onMouseLeave={(e) => (e.target.style.background = "#1d2333")}
                        >
                            {showConsole ? "Hide Console" : "Show Console"}
                        </button>

                        <div
                            style={{
                                flex: 1,
                                position: "relative",
                                overflow: "hidden",
                                minHeight: 0,
                            }}
                        >
                            <SandpackPreview
                                showOpenInCodeSandbox
                                showRefreshButton
                                showNavigator
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    height: "100%",
                                    width: "100%",
                                    backgroundColor: "#011627",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                height: showConsole ? "200px" : "0px",
                                transition: "height 0.3s ease",
                                overflow: "hidden",
                                borderTop: showConsole ? "1px solid #1d2333" : "none",
                            }}
                        >
                            <SandpackConsole
                                showHeader
                                showSyntaxError
                                resetOnPreviewRestart={false}
                                standalone
                                style={{
                                    height: "200px",
                                    overflowY: "auto",
                                    backgroundColor: "#0b0f19",
                                    color: "white",
                                    fontSize: "13px",
                                }}
                            />
                        </div>
                    </div>
                </SandpackLayout>
            </SandpackProvider>
        </div>
    );
}
