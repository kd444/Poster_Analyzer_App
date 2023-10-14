import React, { useState } from "react";
import "./UploadPage.css";

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        setFile(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // TODO: Implement backend integration to upload the file

        setIsUploading(true);
        // TODO: Implement backend integration to initiate the analysis process

        // Once the analysis process is complete, update the uploadedFiles state with the results
        setUploadedFiles([
            ...uploadedFiles,
            { name: file.name, results: "..." },
        ]);
        setIsUploading(false);
    };

    const renderUploadedFilesList = () => {
        return (
            <ul>
                {uploadedFiles.map((file) => (
                    <li key={file.name}>
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
                    <div className="uploaded-files-list">
                        {uploadedFiles.length > 0 && renderUploadedFilesList()}
                    </div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isUploading}
                    >
                        {isUploading ? "Analyzing..." : "Analyze Poster"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
