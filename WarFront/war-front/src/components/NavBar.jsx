import { Link } from "react-router-dom";
import WarLogo from "../assets/WSLogo.jpeg";
import { HomeIcon, InformationCircleIcon, ScaleIcon, ClockIcon } from "@heroicons/react/24/outline"

function NavBar() {
    return (
        <nav className="sticky top-0 w-full p-4 flex justify-between gap-4 bg-[var(--color-dark-grey)] text-[var(--color-off-white)] shadow-lg border-b border-[var(--color-imperial-gold)]">
            <div className="navbar-brand">
                <Link to="/" className="text-xl font-bold hover:text-[var(--color-neon-green)] transition-colors">
                    {/* WarScrapper */}
                    <img src={WarLogo} alt="WarLogo" className="max-w-20" />
                </Link>
            </div>
            <div className="flex gap-4 mt-4">
                <Link to="/" className="nav-link">
                    <HomeIcon className="w-10 h-10 rounded bg-[var(--color-imperial-gold)] p-2 hover:bg-[var(--color-neon-green)] transition-colors" />
                </Link>
                <Link to="/about" className="nav-link">
                    <InformationCircleIcon className="w-10 h-10 rounded bg-[var(--color-imperial-gold)] p-2 hover:bg-[var(--color-neon-green)] transition-colors" />
                </Link>
                <Link to="/factions" className="nav-link">
                    <ScaleIcon className="w-10 h-10 rounded p-2 bg-[var(--color-imperial-gold)] hover:bg-[var(--color-neon-green)] transition-colors" />
                </Link>
                <Link to="/recent-changes" className="nav-link">
                    <ClockIcon className="w-10 h-10 rounded p-2 bg-[var(--color-imperial-gold)] hover:bg-[var(--color-neon-green)] transition-colors" />
                </Link>
            </div>
        </nav>
    )
}

export default NavBar