import { Link } from "react-router-dom";
import {HomeIcon, InformationCircleIcon, ScaleIcon} from "@heroicons/react/24/outline"

function NavBar() {
    return (
    <nav className="sticky top-0 mx-auto w-full p-4 flex justify-between gap-4 bg-gray-300">
        <div className="navbar-brand">
            <Link to="/">WarScrapper</Link>
        </div>
        <div className="flex gap-4">
            <Link to="/" className="nav-link">
                <HomeIcon className="size-10 rounded bg-white" />
            </Link>
            <Link to="/about" className="nav-link">
                <InformationCircleIcon className="size-10 rounded bg-white" />
            </Link>
            <Link to="/factions" className="nav-link">
                <ScaleIcon className="size-10 rounded bg-white"/>
            </Link>
        </div>
    </nav>
    )
}

export default NavBar