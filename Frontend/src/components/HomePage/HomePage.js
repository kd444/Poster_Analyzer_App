import React from "react";
import "./HomePage.css";
import poster from "../../PostersStockImage.jpg";

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="left-section">
                <h1>Welcome to Poster Insights!</h1>
                <p>Analyze and Optimize Your Poster Designs</p>
                <ul>
                    <li>This page is under development</li>
                </ul>
            </div>
            <div className="right-section">
                <img src={poster} alt="Poster image" />
            </div>
            <footer></footer>
        </div>
    );
};

export default HomePage;
