import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import UploadPage from "./components/UploadPage";
import AnalyticsPage from "./components/AnalyticsPage";
import ReportPage from "./components/ReportPage";
import FeedbackPage from "./components/FeedbackPage";
import { Route, Routes } from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" exact component={HomePage} />
                <Route path="/upload" component={UploadPage} />
                <Route path="/analytics" component={AnalyticsPage} />
                <Route path="/report" component={ReportPage} />
                <Route path="/feedback" component={FeedbackPage} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
