import React, { useState } from "react";
import { Link } from "react-router-dom";
import "@mdi/font/css/materialdesignicons.css";
import api from "../../api/api";

const ReportPage = () => {
    const [loading, setLoading] = useState(false);

    const handleShareClick = () => {
        // Open Outlook app to share the report
        window.location.href = "ms-outlook:?subject=Share%20Report";
    };

    const handleDownloadPDFReport = async () => {
        setLoading(true); // Set loading to true

        try {
            const pdfBlob = await api.downloadPDFReport();

            // Create a URL for the blob data
            const url = window.URL.createObjectURL(pdfBlob);

            // Create a temporary <a> element to trigger the download
            const a = document.createElement("a");
            a.href = url;
            a.download = "report.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF report:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackClick = () => {
        window.location.href = "/feedback";
    };

    return (
        <div className="report-page">
            <h1>Reports</h1>
            <div className="buttons">
                <button onClick={handleShareClick}>
                    <i className="mdi mdi-share-variant"></i>
                    Share
                </button>
                <button onClick={handleDownloadPDFReport}>
                    <i className="mdi mdi-download"></i>
                    Download
                </button>
                <button onClick={handleFeedbackClick}>
                    <i className="mdi mdi-feedback"></i>
                    Feedback
                </button>
            </div>
            {loading && <div className="loader">Loading...</div>}
        </div>
    );
};

export default ReportPage;
