// import { ReactComponent as Brand } from "../../assets/icons/logo.svg";
import logo from "../poster.png";
import "./navbar.css";
import { NavLink } from "react-router-dom";
// -

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="logo">
                    <img src={logo} alt="Logo" width="30" height="30" />
                </div>
                <div className="label">
                    <div className="poster-insights">
                        Poster
                        <br /> Insights
                    </div>
                </div>
                <div className="nav-elements">
                    <ul>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/upload">Upload</NavLink>
                        </li>
                        <li>
                            <NavLink to="/analytics">Analytics</NavLink>
                        </li>
                        <li>
                            <NavLink to="/report">Report</NavLink>
                        </li>
                        <li>
                            <NavLink to="/feedback">Feedback</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
