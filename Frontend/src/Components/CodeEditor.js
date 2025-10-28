import React, { useState, useEffect } from "react";
import {
    SandpackLayout,
    SandpackProvider,
    SandpackPreview,
    SandpackConsole,
    useActiveCode,
    SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ files, currentFile, setFiles }) {



    const [showConsole, setShowConsole] = useState(false);

    if (!currentFile) return <div>Select a file to edit</div>;

    return (
        <div style={{ height: "100vh", backgroundColor: "#011627" }}>
            <SandpackProvider
                key={currentFile}
                files={files}
                template="react"
                theme="dark"
                options={{ activeFile: currentFile, showLineNumbers: true }}
                customSetup={{ entry: "/index.js" }}
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
                    {/* Left Column — Code Editor */}
                    <div style={{ height: "100%", overflow: "hidden" }}>
                        <MonacoWrapper currentFile={currentFile} setFiles={setFiles} />
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
                        {/* Console Toggle Button */}
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

                        {/* Preview */}
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

                        {/* Console Section (Collapsible) */}
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








const MonacoWrapper = ({ currentFile, setFiles }) => {
    const { code, updateCode } = useActiveCode();
    const [internalCode, setInternalCode] = useState(code || "");
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        if (!code || code.trim() === "") {
            setInternalCode("// New file");
            updateCode("// New file");
        } else {
            setInternalCode(code);
        }
    }, [currentFile]);

    const handleChange = (newCode) => {
        if (newCode === undefined) return;
        setInternalCode(newCode);

        if (timeoutId) clearTimeout(timeoutId);

        const id = setTimeout(() => {
            updateCode(newCode);

            setFiles((prev) => {
                if (!currentFile) return prev;

                const pathParts = currentFile.split("/").filter(Boolean); // remove empty strings
                const fileName = pathParts.pop(); // last item is filename

                // Deep clone to avoid direct mutation
                const newFiles = JSON.parse(JSON.stringify(prev));
                let node = newFiles;

                // Traverse down folders safely
                for (const part of pathParts) {
                    if (typeof node[part] !== "object") {
                        node[part] = {}; // make sure it's an object (folder)
                    }
                    node = node[part];
                }

                // ✅ Ensure we’re replacing only the correct nested file
                node[fileName] = newCode;

                return newFiles;
            });
        }, 400);

        setTimeoutId(id);
    };

    return (
        <Editor
            language="javascript"
            theme="vs-dark"
            value={internalCode}
            onChange={handleChange}
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
    );
};

