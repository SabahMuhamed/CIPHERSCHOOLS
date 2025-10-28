import React, { useState } from "react";

export default function Sidebar({
    isOpen,
    fileTree,
    openFile,
    addItem,
    deleteItem,
    setCurrentFile
}) {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);

    const toggleFolder = (folderPath) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [folderPath]: !prev[folderPath],
        }));
    };

    const handleSelect = (fullPath, isFolder) => {
        console.log("Clicked file/folder:", fullPath);
        setSelectedItem(fullPath);

        if (isFolder) {
            toggleFolder(fullPath);
            setCurrentFile(fullPath);
        } else {
            openFile(fullPath);
        }
    };

    // ✅ Recursively render file tree with full path tracking
    const renderTree = (tree, level = 0, currentPath = "") =>
        Object.keys(tree).map((key) => {
            const node = tree[key];
            const isFolder = typeof node === "object";
            const fullPath = currentPath ? `${currentPath}/${key}` : key;

            return (
                <div key={fullPath} style={{ paddingLeft: level * 20 }}>
                    <div
                        className={`tree-item ${selectedItem === fullPath ? "selected" : ""}`}
                        onClick={() => handleSelect(fullPath, isFolder)}
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: "3px 0",
                            userSelect: "none",
                        }}
                    >
                        {isFolder ? (
                            expandedFolders[fullPath] ? (
                                <span style={{ marginRight: 6 }}>📂</span>
                            ) : (
                                <span style={{ marginRight: 6 }}>📁</span>
                            )
                        ) : (
                            <span style={{ marginRight: 6 }}>📄</span>
                        )}
                        {key}
                    </div>

                    {isFolder && expandedFolders[fullPath] && renderTree(node, level + 1, fullPath)}
                </div>
            );
        });

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <h3>File Explorer</h3>
                <div className="sidebar-actions">
                    <button onClick={addItem}>＋</button>
                    <button
                        onClick={() => deleteItem(selectedItem)}
                        disabled={!selectedItem}
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div className="file-tree">{renderTree(fileTree)}</div>
        </aside>
    );
}
