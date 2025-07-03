// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
        <Navbar />
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center text-center px-4 py-20 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 mb-6 transition duration-500 hover:scale-105">
          🚀 AutoApply - Internships & Jobs Made Easy
        </h1>
        <p className="max-w-xl text-gray-600 text-lg mb-10 animate-pulse">
          Discover top companies. Automate your internship and job applications. Save time, track progress, and increase your chances – all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/search"
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded shadow hover:bg-gray-400 transition-all duration-300"
          >
            Search Jobs
          </Link>
        </div>

        <div className="mt-16 max-w-4xl text-left animate-fade-in delay-200">
          <h2 className="text-2xl font-semibold mb-4">🔧 How it works</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Search top jobs & internships across LinkedIn, Indeed, Glassdoor.</li>
            <li>Use a pre-saved resume for 1-click applications.</li>
            <li>Track applied jobs and resume in your dashboard.</li>
            <li>Shortlist your favorite jobs for later.</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-sm py-4 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
          <p>&copy; {new Date().getFullYear()} AutoApply. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="https://github.com/Vedansh-017" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
