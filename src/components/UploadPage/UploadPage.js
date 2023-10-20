import React, { useState } from "react";
import "./UploadPage.css";
import api from "../../api/api";

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setFile(file);
    };

    const handleFileInput = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };
    const handleUpload = async () => {
        setIsUploading(true);

        try {
            const response = await api.uploadPoster(file);

            if (response.status === 201) {
                // Upload was successful
                // Start the analysis process
                await api.startAnalysis();

                // Once the analysis process is complete, update the uploadedFiles state with the results
                const results = await api.getContentSummary();

                setUploadedFiles([
                    ...uploadedFiles,
                    { name: file.name, results },
                ]);
            } else {
                // Upload failed
                console.error(response.data);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }

        setIsUploading(false);
    };

    const handleAnalyze = async () => {
        try {
            // Start the analysis process
            await api.startAnalysis();
        } catch (error) {
            console.error("An error occurred:", error);
        }
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
                            Upload Poster
                        </button>
                        <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={isUploading || !file}
                        >
                            Analyze Poster
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
