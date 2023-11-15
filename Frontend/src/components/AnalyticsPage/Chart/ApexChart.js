import React from "react";
import Chart from "react-apexcharts";

const ApexChart = ({ options, series, type, width }) => {
    return (
        <Chart options={options} series={series} type={type} width={width} />
    );
};

export default ApexChart;
