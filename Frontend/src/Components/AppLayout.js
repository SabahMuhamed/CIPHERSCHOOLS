import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./sidebar";
import CodeEditor from "./CodeEditor";
import "../App.css";
import axios from "axios";

export default function AppLayout() {


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

    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem("files");
        return saved ? JSON.parse(saved) : initialfile;
    });

    useEffect(() => {
        localStorage.setItem("files", JSON.stringify(files));
    }, [files]);
    const saveFiles = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!token) {
            if (user) {
                navigate("/login");
                return;
            }
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ownerId: user._id,
                    files: files,
                }),
            });

    };



    useEffect(() => {
        if (Object.keys(files).length > 0) {
            const timeout = setTimeout(() => {
                saveFiles();
            }, 2000); // save files automaticaly for every inactive 2 seconds
            return () => clearTimeout(timeout);
        }
    }, [files]);


    useEffect(() => {
        const loadUserFiles = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");
            if (!user || !token) return;

            try {
                const response = await axios.get(`http://localhost:3001/getFiles/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userFiles = response.data;

                if (Object.keys(userFiles).length > 0) {
                    setFiles(userFiles);
                } else {
                    setFiles(initialfile);
                }
            } catch (error) {
                console.error("Error loading user files:", error);
            }
        };

        loadUserFiles();
    }, []);





    const [currentFile, setCurrentFile] = useState("App.js");
    const [openTabs, setOpenTabs] = useState(["App.js"]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const openFile = (filename) => {
        // get the filetype
        const item = getFileContent(files, filename);

        //  object=folder,then do not open in editor
        if (typeof item === "object") {
            console.log("📁 Folder clicked:", filename);
            return; 
        }

        // if not object,open in editor
        setCurrentFile(filename);
        if (!openTabs.includes(filename)) {
            setOpenTabs([...openTabs, filename]);
        }
    };


    // get filecontent from nested folders
    const getFileContent = (tree, fullPath) => {
        const pathParts = fullPath.split("/");
        let node = tree;

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            if (!node[part]) return "";
            node = node[part];
        }

        return typeof node === "string" ? node : "";
    };

   // for Adding a newfile
    const addItem = async () => {
        const name = prompt("Enter file/folder name:");
        if (!name) return;
        if (files[name]) return alert(`${name} already exists!`);

        const newFiles = { ...files };

        // adding into a folder
        const addToFolder = (tree) => {
            if (tree[currentFile] && typeof tree[currentFile] === "object") {
                if (!name.includes(".")) tree[currentFile][name] = {}; // folder
                else tree[currentFile][name] = "// New file"; // file
                return true;
            }
            for (let key in tree) {
                if (typeof tree[key] === "object") {
                    if (addToFolder(tree[key])) return true;
                }
            }
            return false;
        };

        const added = addToFolder(newFiles);

        if (!added) {
            if (!name.includes(".")) newFiles[name] = {}; // if the name contains "." it will be folder
            else newFiles[name] = "// New file"; 
        }

        setFiles(newFiles);
        setCurrentFile(name);
        if (!openTabs.includes(name)) setOpenTabs([...openTabs, name]);

        // Saving to DataBase
        await saveFiles(newFiles);
    };

    const deleteRecursive = (tree, keyToDelete) => {
        const newTree = { ...tree };
        for (const key in newTree) {
            if (key === keyToDelete) {
                delete newTree[key];
                return newTree;
            }
            if (typeof newTree[key] === "object") {
                newTree[key] = deleteRecursive(newTree[key], keyToDelete);
            }
        }
        return newTree;
    };

    const deleteItem = () => {
        if (!currentFile) {
            alert("No item selected to delete.");
            return;
        }
        if (!window.confirm(`Are you sure you want to delete "${currentFile}"?`)) return;

        const updatedFiles = deleteRecursive(files, currentFile);
        setFiles(updatedFiles);

        const newTabs = openTabs.filter((f) => f !== currentFile);
        setOpenTabs(newTabs);

        const remainingFiles = Object.keys(updatedFiles).filter(
            (k) => typeof updatedFiles[k] === "string"
        );
        setCurrentFile(newTabs.length > 0 ? newTabs[newTabs.length - 1] : remainingFiles[0] || "");

        // saving to Database
        saveFiles(updatedFiles);
    };



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
                    setCurrentFile={setCurrentFile}
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
                                {file}
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newTabs = openTabs.filter((f) => f !== file);
                                        setOpenTabs(newTabs);
                                        if (currentFile === file) setCurrentFile(newTabs[newTabs.length - 1] || Object.keys(files)[0]);
                                    }}
                                    style={{ marginLeft: "8px", color: "#ff5c5c", cursor: "pointer" }}
                                >
                                    ×
                                </span>
                            </div>
                        ))}
                    </div>

                    <CodeEditor files={files} currentFile={currentFile} setFiles={setFiles}
                        openFile={openFile}
                    />
                </div>
            </div>
            {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        </div>
    );
}

