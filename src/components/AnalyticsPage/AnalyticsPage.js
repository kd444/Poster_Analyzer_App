import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AnalyticsPage.css";
import api from "../../api/api";
import { useEffect } from "react";
const ImageQuality = () => {
    const [imageQuality, setImageQuality] = useState(0);
    const [reportContent, setReportContent] = useState("");

    useEffect(() => {
        async function fetchData() {
            const report = await api.getReport();
            if (report) {
                setImageQuality(report.imageQuality);
                setReportContent(report.reportContent);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="image-quality">
            <h3>Image Quality</h3>
            <p>Image quality: {imageQuality}</p>
            <p>Report: {reportContent}</p>
        </div>
    );
};

const ContentSummary = () => {
    const [contentSummary, setContentSummary] = useState("");

    return (
        <div className="content-summary">
            <h3>Content Summary</h3>
            <p>Content summary: {contentSummary}</p>
        </div>
    );
};

const LinkValidation = () => {
    const [linkValidationResults, setLinkValidationResults] = useState([]);

    return (
        <div className="link-validation">
            <h3>Link Validation</h3>
            <ul>
                {linkValidationResults.map((result) => (
                    <li key={result.url}>
                        {result.url}: {result.isValid ? "Valid" : "Invalid"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AccessibilityInsights = () => {
    const [accessibilityInsights, setAccessibilityInsights] = useState([]);

    return (
        <div className="accessibility-insights">
            <h3>Accessibility Insights</h3>
            <ul>
                {accessibilityInsights.map((insight) => (
                    <li key={insight.id}>{insight.description}</li>
                ))}
            </ul>
        </div>
    );
};

const ExtractedText = () => {
    const [extractedText, setExtractedText] = useState("");

    useEffect(() => {
        async function fetchData() {
            const report = await api.getReport();
            if (report) {
                setExtractedText(report.extractedText);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="extracted-text">
            <h3>Extracted Text</h3>
            <p>{extractedText}</p>
        </div>
    );
};

const AnalyticsPage = () => {
    const [currentComponent, setCurrentComponent] = useState(0);

    const components = [
        <ImageQuality />,
        <ContentSummary />,
        <LinkValidation />,
        <AccessibilityInsights />,
        <ExtractedText />,
    ];

    const handleNextComponent = () => {
        setCurrentComponent((currentComponent + 1) % components.length);
    };

    const handlePreviousComponent = () => {
        setCurrentComponent((currentComponent - 1) % components.length);
    };

    return (
        <div className="analytics-page">
            <div className="components">{components[currentComponent]}</div>
            <div className="navigation">
                <button onClick={handlePreviousComponent}>Previous</button>
                <button onClick={handleNextComponent}>Next</button>
            </div>
            <Link to="/report">
                <button className="generate-report">Generate Report</button>
            </Link>
        </div>
    );
};

export default AnalyticsPage;
