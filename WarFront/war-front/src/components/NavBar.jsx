import { Link } from "react-router-dom";

function NavBar() {
    return (
    <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">WarScrapper App</Link>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/factions" className="nav-link">factions</Link>
        </div>
    </nav>
    )
}

export default NavBar