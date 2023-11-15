import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AnalyticsPage.css";
import api from "../../api/api";
import ColorAnalysisTable from "./ColorAnalysisTable/ColorAnalysisTable";
import Loader from "../Loader/Loader";
import ApexChart from "./Chart/ApexChart";

const tabs = [
    "Accessibility Insights",
    "Content Summary",
    "Extracted Text",
    "Link Validation",
];

const AnalyticsPage = () => {
    const [currentTab, setCurrentTab] = useState(tabs[0]);
    const [reportData, setReportData] = useState({});
    const [loading, setLoading] = useState(true);
    const [apexChartOptions, setApexChartOptions] = useState({});

    async function fetchData() {
        try {
            setLoading(true);
            const report = await api.getReport();
            if (report && report.report) {
                setReportData(report);
                if (report.report[5]?.data) {
                    // Extracting color data for the pie chart
                    const colorData = report.report[5].data;
                    const colors = colorData.map((item) => item[0]);
                    const percentages = colorData.map((item) => item[1]);

                    const options = {
                        chart: {
                            type: "donut",
                        },
                        labels: colors,
                        series: percentages,
                        colors: colors,
                    };

                    setApexChartOptions(options);
                }
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (Object.keys(reportData).length === 0) {
            fetchData();
        }
    }, [reportData]);

    const options = {
        chart: {
            id: "my-chart",
        },
        colors: ["red", "pink", "white", "yellow"],
        xaxis: {},
        yaxis: {
            title: "Sales",
        },
    };

    const series = [20, 30, 50];

    return (
        <div className="analytics-page">
            <div className="tab-navigation">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={tab === currentTab ? "active" : ""}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="tab-content">
                    {currentTab === "Content Summary" && reportData.report && (
                        <div className="content-summary">
                            <h3>Content Summary</h3>
                            <p>{reportData.report[0]?.data[0] || "No data"}</p>
                        </div>
                    )}
                    {currentTab === "Extracted Text" && reportData.report && (
                        <div className="extracted-text">
                            <h3>Extracted Text</h3>
                            <p className="extracted-text-content">
                                {reportData.report[1]?.data[0] || "No data"}
                            </p>
                        </div>
                    )}
                    {currentTab === "Link Validation" && reportData.report && (
                        <div className="link-validation">
                            <h3>Link Validation</h3>
                            <table>
                                <tr>
                                    <th>Link</th>
                                    <th>Status</th>
                                </tr>
                                <tr>
                                    <td>Link1</td>
                                    <td>
                                        {reportData.report[2]?.data["link1"]
                                            ? "✔️"
                                            : "❌"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Link2</td>
                                    <td>
                                        {reportData.report[2]?.data["link2"]
                                            ? "✔️"
                                            : "❌"}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    )}
                    {currentTab === "Accessibility Insights" && (
                        <div className="accessibility-insights">
                            <h3>Accessibility Insights</h3>
                            <div className="accessibility-section">
                                <h4>Color Analysis</h4>
                                <div className="accessibility-section">
                                    {/* <ColorAnalysisTable
                                        data={reportData.report[5]?.data}
                                    /> */}
                                    <div>
                                        {/* options={options}
                                        series={series} */}
                                        <ApexChart
                                            className="chart"
                                            options={apexChartOptions}
                                            series={apexChartOptions.series}
                                            type="donut"
                                            width="400"
                                        />
                                    </div>
                                </div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Color Relevance Measure:</td>
                                            <td>
                                                {reportData.report[5]?.data &&
                                                    reportData.report[5]?.data[
                                                        "Color Relevance Measure"
                                                    ]}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Recommendations:</td>
                                            <td>
                                                {reportData.report[5]?.data &&
                                                    reportData.report[5]?.data
                                                        .Recommendations}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="accessibility-section">
                                <h4>Image Quality</h4>

                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Resolution:</td>
                                            <td>
                                                {reportData.report[3]?.data
                                                    .Resolution || "No data"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Sharpness:</td>
                                            <td>
                                                {
                                                    reportData.report[3]?.data
                                                        .Sharpness
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Contrast:</td>
                                            <td>
                                                {
                                                    reportData.report[3]?.data
                                                        .Contrast
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="accessibility-section">
                                <h4>Text Quality</h4>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Font Used:</td>
                                            <td>
                                                {
                                                    reportData.report[4]?.data[
                                                        "Font Used"
                                                    ]
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Text Size:</td>
                                            <td>
                                                {
                                                    reportData.report[4]?.data[
                                                        "Text Size"
                                                    ]
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Recommendation:</td>
                                            <td>
                                                {
                                                    reportData.report[4]?.data
                                                        .Recommendation
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {currentTab === "Accessibility Insights" && !loading && (
                <div className="pie-chart">
                    {/* <ApexChart colors={ApexChartColors} /> */}
                </div>
            )}

            <Link to="/report">
                <button className="generate-report">Generate Report</button>
            </Link>
        </div>
    );
};

export default AnalyticsPage;
