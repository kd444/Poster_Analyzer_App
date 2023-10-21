import React from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = ({ colors }) => {
    const chartData = {
        options: {
            chart: {
                type: "pie",
            },
            labels: ["Red", "Green", "Blue"],
        },
        series: colors,
    };

    return (
        <div className="pie-chart">
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="pie"
                height="350"
            />
        </div>
    );
};

export default PieChart;
