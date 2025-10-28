import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { EditorProvider } from "./context/editorContext";
import system from "./theme";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <ChakraProvider value={system}>
      <EditorProvider>
        <App />

      </EditorProvider>
    </ChakraProvider>

  </React.StrictMode>
);
