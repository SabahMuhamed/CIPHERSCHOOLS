import { useState, useEffect } from "react";
import axios from "axios";

export default function useFileManager(initialFile, navigate) {
    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem("files");
        return saved ? JSON.parse(saved) : initialFile;
    });

    const [currentFile, setCurrentFile] = useState("App.js");
    const [openTabs, setOpenTabs] = useState(["App.js"]);

    // Saving to localStorage
    useEffect(() => {
        localStorage.setItem("files", JSON.stringify(files));
    }, [files]);

    // Saving  to DB
    const saveFiles = async (fileData = files) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!token) {
            if (user) navigate("/login");
            console.warn("⚠️ No token found — skipping DB sync");
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
                    files: fileData,
                }),
            });
            console.log("✅ Files synced with DB:", await response.json());
        } catch (error) {
            console.error("❌ Error syncing files:", error);
        }
    };

    // Auto-save after 2s of inactivity
    useEffect(() => {
        if (Object.keys(files).length > 0) {
            const timeout = setTimeout(() => saveFiles(), 2000);
            return () => clearTimeout(timeout);
        }
    }, [files]);

    // Load user files on mount
    useEffect(() => {
        const loadUserFiles = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");
            if (!user || !token) return;

            try {
                const response = await axios.get(
                    `http://localhost:3001/getFiles/${user._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const userFiles = response.data;
                setFiles(Object.keys(userFiles).length > 0 ? userFiles : initialFile);
            } catch (error) {
                console.error("Error loading user files:", error);
            }
        };
        loadUserFiles();
    }, []);

    // Get node by path
    const getFileContent = (tree, fullPath) => {
        const pathParts = fullPath.split("/").filter(Boolean);
        let node = tree;

        for (const part of pathParts) {
            if (!node || typeof node !== "object" || !(part in node)) {
                return null;
            }
            node = node[part];
        }

        return node;
    };

    //  Check if path is a folder
    const isFolder = (path) => {
        if (!path) return false;
        const item = getFileContent(files, path);
        return item && typeof item === "object";
    };

    // Open a file
    const openFile = (filename) => {
        const item = getFileContent(files, filename);
        if (typeof item === "object") {
            console.log("📁 Folder clicked:", filename);
            return;
        }

        setCurrentFile(filename);
        if (!openTabs.includes(filename)) {
            setOpenTabs((prev) => [...prev, filename]);
        }
    };

    // Add new file or folder
    const normalizePath = (path) => path.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
    const addItem = async () => {
        const name = prompt("Enter file/folder name (no '.' → folder):");
        if (!name) return;

        const newFiles = structuredClone(files);

        let targetFolder = currentFile || "";
        const parts = targetFolder.split("/").filter(Boolean);

      
        let node = newFiles;
        let currentNode = newFiles;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            // If it is a file dont add inside
            if (i === parts.length - 1 && typeof currentNode[part] === "string") {
                parts.pop();
                break;
            }
            if (!currentNode[part]) currentNode[part] = {};
            currentNode = currentNode[part];
        }

        
        node = newFiles;
        for (const part of parts) {
            node = node[part];
        }

        // Check if a file already exists 
        if (node[name]) {
            alert(`⚠️ '${name}' already exists in this folder!`);
            return;
        }

        
        if (name.includes(".")) {
            node[name] = "// New file";
            const fullPath = normalizePath([...parts, name].join("/"));
            setFiles(newFiles);
            setCurrentFile(fullPath);
            if (!openTabs.includes(fullPath)) {
                setOpenTabs([...openTabs, fullPath]);
            }
        } else {
            node[name] = {};
            setFiles(newFiles); 
            // Don't set currentFile or openTab for folders
        }

        await saveFiles(newFiles);
    };



    // Delete file or folder 
    const deleteByPath = (tree, pathParts) => {
        if (pathParts.length === 0) return tree;

        const [current, ...rest] = pathParts;
        const newTree = { ...tree };

        if (rest.length === 0) {
            // delete 
            delete newTree[current];
        } else if (typeof newTree[current] === "object") {
            newTree[current] = deleteByPath(newTree[current], rest);
        }

        return newTree;
    };

    const deleteItem = () => {
        if (!currentFile) {
            alert("No item selected to delete.");
            return;
        }

        if (!window.confirm(`Delete "${currentFile}"?`)) return;

        const pathParts = currentFile.split("/").filter(Boolean);
        const updatedFiles = deleteByPath(files, pathParts);

        setFiles(updatedFiles);

        const newTabs = openTabs.filter((f) => f !== currentFile);
        setOpenTabs(newTabs);

        setCurrentFile(newTabs[newTabs.length - 1] || "");
        saveFiles(updatedFiles);
    };

    // showing only filename in tabs
    const getTabName = (path) => path.split("/").pop();

    return {
        files,
        setFiles,
        currentFile,
        setCurrentFile,
        openTabs,
        setOpenTabs,
        openFile,
        addItem,
        deleteItem,
        getFileContent,
        isFolder,
        getTabName, 
    };
}
