import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import UploadPage from "./components/UploadPage/UploadPage";
import AnalyticsPage from "./components/AnalyticsPage/AnalyticsPage";
import ReportPage from "./components/ReportPage/ReportPage";
import FeedbackPage from "./components/FeedbackPage/FeedbackPage";
import { Route, Routes } from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" exact element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
