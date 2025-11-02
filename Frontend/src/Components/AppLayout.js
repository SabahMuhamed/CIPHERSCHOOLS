import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./sidebar";
import CodeEditor from "./CodeEditor";
import useFileManager from "../hooks/useFileManager";
import "../App.css";

export default function AppLayout() {
    const navigate = useNavigate()

    const initialfile = {
        public: {
            "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Code Editor</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
        },
        "App.js": `export default function App() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome to the React Code Editor!</h1>
      <p>Edit this file to see live updates 👇</p>
    </div>
  );
}`,
        "index.js": `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
        "style.css": `body {
  background: #0f0a19;
  color: white;
  font-family: sans-serif;
  margin: 0;
}`,
        "package.json": `{
  "name": "react-code-editor",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
        ".gitignore": `node_modules/
build/
.env
.vscode/`,
        "README.md": `# React Code Editor

Simple React-based code editor with file tree & live preview.`,
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        files,
        setFiles,
        currentFile,
        setCurrentFile,
        openTabs,
        setOpenTabs,
        openFile,
        addItem,
        deleteItem,
        getTabName,
        getFileContent
    } = useFileManager(initialfile, navigate);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="app-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className="main-content">
                <Sidebar
                    isOpen={sidebarOpen}
                    fileTree={files}
                    openFile={openFile}
                    addItem={addItem}
                    deleteItem={deleteItem}
                    currentFile={currentFile}
    

                />
                <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                    {/* Tab bar */}
                    <div style={{ display: "flex", background: "#1e1e1e", borderBottom: "1px solid #555" }}>
                        {openTabs.map((file) => (
                            <div
                                key={file}
                                onClick={() => setCurrentFile(file)}
                                style={{
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    color: "white",
                                    background: currentFile === file ? "#333" : "transparent",
                                    borderRight: "1px solid #555",
                                }}
                            >
                                {getTabName(file)}
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newTabs = openTabs.filter((f) => f !== file);
                                        setOpenTabs(newTabs);
                                        if (currentFile === file)
                                            setCurrentFile(newTabs[newTabs.length - 1] || Object.keys(files)[0]);
                                    }}
                                    style={{ marginLeft: "8px", color: "#ff5c5c", cursor: "pointer" }}
                                >
                                    ×
                                </span>
                            </div>
                        ))}
                    </div>

                    <CodeEditor getFileContent={getFileContent} files={files} currentFile={currentFile} setFiles={setFiles} openFile={openFile} />
                </div>
            </div>
            {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        </div>
    );
}
