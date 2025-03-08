"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import "../styles/navbar.css"
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/"><svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="#1DB954"/>
  <path d="M18 38V30C18 22 24 16 32 16C40 16 46 22 46 30V38" stroke="white" strokeWidth="4" strokeLinecap="round"/>
  <rect x="12" y="36" width="10" height="14" rx="2" fill="white"/>
  <rect x="42" y="36" width="10" height="14" rx="2" fill="white"/>
</svg></Link>
<Link href="/"><div className="website-header"> SonicWaves</div></Link>
      </div>
      
      {/* Desktop Menu */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/albums">Albums</Link></li>
        <li><Link href="#">Artists</Link></li>
        <li><Link href="#">Playlists</Link></li>
        <li><Link href="#">Contact</Link></li>
      </ul>

      {/* Hamburger Menu (Mobile) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </div>
    </nav>
  );
}
