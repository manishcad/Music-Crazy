"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import "../styles/navbar.css"
import Image from 'next/image'
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/"><Image className="header-logo" src="/logo.webp" alt="Logo" width={50} height={50}></Image></Link>
<Link href="/"><div className="neon-text"> SonicWaves</div></Link>
      </div>
      
      {/* Desktop Menu */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li className="neon-link"><Link href="/">Home</Link></li>
        <li className="neon-link"><Link href="/albums">Albums</Link></li>
        <li className="neon-link"><Link href="/hindi">Hindi Albums</Link></li>
        <li className="neon-link"><Link href="#">Playlists</Link></li>
        <li className="neon-link"><Link href="#">Contact</Link></li>
      </ul>

      {/* Hamburger Menu (Mobile) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </div>
    </nav>
  );
}
