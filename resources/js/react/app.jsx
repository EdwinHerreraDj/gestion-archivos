// resources/js/react/app.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import FileManager from "./components/FileManager";
import FolderShow from "./components/FolderShow";
import { ToastProvider } from "./components/Toast";

const elIndex = document.getElementById("file-manager-root");
if (elIndex) {
    const props = JSON.parse(elIndex.dataset.props || "{}");
    createRoot(elIndex).render(
        <ToastProvider>
            <FileManager {...props} />
        </ToastProvider>,
    );
}

const elShow = document.getElementById("folder-show-root");
if (elShow) {
    const props = JSON.parse(elShow.dataset.props || "{}");
    createRoot(elShow).render(
        <ToastProvider>
            <FolderShow {...props} />
        </ToastProvider>,
    );
}
