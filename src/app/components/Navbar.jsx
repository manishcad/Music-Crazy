"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">🎵 MusicApp</Link>
      </div>
      
      {/* Desktop Menu */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/albums">Albums</Link></li>
        <li><Link href="/artists">Artists</Link></li>
        <li><Link href="/playlists">Playlists</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>

      {/* Hamburger Menu (Mobile) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </div>
    </nav>
  );
}
