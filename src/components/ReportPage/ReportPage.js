import React from "react";
import { Link } from "react-router-dom";
import "@mdi/font/css/materialdesignicons.css";
import api from "../../api/api";

const ReportPage = () => {
    const handleShareClick = () => {
        // Open Outlook app to share the report
        window.location.href = "ms-outlook:?subject=Share%20Report";
    };

    const handleDownloadClick = () => {
        // download the report generated from backend
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
                <button onClick={handleDownloadClick}>
                    <i className="mdi mdi-download"></i>
                    Download
                </button>
                <button onClick={handleFeedbackClick}>
                    <i className="mdi mdi-feedback"></i>
                    Feedback
                </button>
            </div>
        </div>
    );
};

export default ReportPage;
