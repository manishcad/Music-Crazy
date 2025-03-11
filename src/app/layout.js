import { Geist, Geist_Mono } from "next/font/google";
import { MusicPlayerProvider } from "./context/MusicPlayerContext";
import MusicPlayer from "./components/MusicPlayer";
import Navbar from "./components/Navbar";
import "./globals.css";
import { Suspense } from "react";

console.log("ok");
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sonic Waves",
  description: "Your Website Description",
  
};
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
              <link rel="icon" href="/public/favicon.ico" />
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3356353210313034"
     crossorigin="anonymous"></script>
          </head>
            <body>
                <Suspense fallback={<p>Loading</p>}>
                <MusicPlayerProvider>
                      <Navbar />
                      {children}
                      <MusicPlayer /> {/* Ensure it's always present */}
                  </MusicPlayerProvider>

              </Suspense>
            </body>
        </html>
    );
}
