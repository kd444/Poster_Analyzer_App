import React from "react";

const ColorAnalysisTable = ({ data }) => {
    return (
        <div className="color-analysis">
            <table>
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((colorData, index) => (
                        <tr key={index}>
                            <td>
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: colorData[0],
                                        display: "inline-block",
                                    }}
                                ></div>
                                {colorData[0]}
                            </td>
                            <td>{`${colorData[1]}%`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ColorAnalysisTable;
