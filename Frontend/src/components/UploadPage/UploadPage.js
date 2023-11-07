import React, { useState } from "react";
import "./UploadPage.css";
import api from "../../api/api";
import Alert from "../Alert/Alert";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker";
// set up worker
// pdfjsLib.GlobalWorkerOptions.workerSrc =
//     "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js";

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileType, setFileType] = useState(null);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        handleFileSelection(droppedFile);
    };

    const handleFileInput = (event) => {
        const selectedFile = event.target.files[0];
        handleFileSelection(selectedFile);
    };
    const convertPDFToImages = async (pdfFile) => {
        const pdfImages = [];

        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(pdfFile))
            .promise;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            const canvasContext = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext,
                viewport,
            };

            const renderTask = page.render(renderContext);
            await renderTask.promise;

            // Convert canvas content to base64 image data URL
            const imageDataURL = canvas.toDataURL("image/png");

            pdfImages.push(imageDataURL);
        }

        return pdfImages;
    };
    const handleFileSelection = async (selectedFile) => {
        if (selectedFile) {
            if (selectedFile.type === "application/pdf") {
                const pdfImages = await convertPDFToImages(selectedFile);

                setFile({
                    file: pdfImages,
                    name: selectedFile.name,
                });
                setFileType("pdf"); // Set file type to PDF
            } else if (selectedFile.type.startsWith("image/")) {
                // Handle image file
                setFile({
                    file: selectedFile,
                    name: selectedFile.name,
                });
                setFileType("image");
            }
        }
    };

    // Helper function to convert a data URL to a Blob
    const dataURLToBlob = (dataURL) => {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const handleUpload = async () => {
        setIsUploading(true);

        try {
            if (fileType === "pdf") {
                // Handle PDF images
                const inputFile = file.file;
                const blob = dataURLToBlob(inputFile[0]);
                const response = await api.uploadPoster(blob);
                setUploadedFiles([...uploadedFiles, response]);
            } else if (fileType === "image") {
                // Handle image upload
                const response = await api.uploadPoster(file.file);
                setResponse(response);
            }
            setResponse(null);
        } catch (error) {
            console.error("An error occurred:", error);
        }

        setIsUploading(false);
    };

    const renderUploadedFilesList = () => {
        return (
            <ul>
                {uploadedFiles.map((file, index) => (
                    <li key={index}>
                        {file.name} - {file.results}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="upload-page">
            <div className="card">
                <div className="card-content">
                    <div className="upload-area">
                        <h3>Drop files here to upload</h3>
                        <div
                            className={`drop-target ${
                                file ? "file-dropped" : ""
                            }`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {file ? (
                                <div className="file-name">{file.name}</div>
                            ) : (
                                <div>Drop files here to upload</div>
                            )}
                        </div>
                    </div>

                    <div className="choose-file-area">
                        <label>Choose File</label>
                        <input type="file" onChange={handleFileInput} />
                    </div>

                    <div className="uploaded-files-list">
                        {uploadedFiles.length > 0 && renderUploadedFilesList()}
                    </div>

                    <div className="upload-buttons-area">
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading || !file}
                        >
                            Upload & Analyze
                        </button>
                    </div>

                    {response && <Alert message={response.message} />}
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
