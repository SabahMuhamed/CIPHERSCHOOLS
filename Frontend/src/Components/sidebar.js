import React, { useState } from "react";

export default function Sidebar({
    isOpen,
    fileTree,
    openFile,
    addItem,
    deleteItem,
}) {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);

    const toggleFolder = (path) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const handleSelect = (path, isFolder) => {
        setSelectedItem(path)

        if (isFolder) {
            toggleFolder(path);
            console.log("📁 Folder clicked:", path);

        } else {

            console.log("File clicked:", path);
            openFile(path);
        }
    };

    const renderTree = (tree, level = 0, base = "") =>
        Object.keys(tree).map((key) => {
            const node = tree[key];
            const isFolder = typeof node === "object";
            const fullPath = base ? `${base}/${key}` : key;

            return (
                <div key={fullPath} style={{ paddingLeft: level * 18 }}>
                    <div
                        className={`tree-item ${selectedItem === fullPath ? "selected" : ""}`}
                        onClick={() => handleSelect(fullPath, isFolder)}
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: "4px 0",
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
                    <button onClick={() => deleteItem(selectedItem)} disabled={!selectedItem}>
                        🗑️
                    </button>
                </div>
            </div>


            <div
                className="file-tree-scroll"
                style={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 80px)",
                    paddingRight: 6,
                }}
            >
                <div className="file-tree">{renderTree(fileTree)}</div>
            </div>
        </aside>

    );


}
