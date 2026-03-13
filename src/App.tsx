/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavBar } from "./components/NavBar";
import { Hero } from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <main className="min-h-screen flex flex-col bg-[#fcf7ee] selection:bg-[#2200b8] selection:text-[#fcf7ee]">
      <NavBar />
      <Hero />
      <div className="w-full h-px bg-[#2200b8]" />
      <AboutMe />
      <Footer />
    </main>
  );
}

