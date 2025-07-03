import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/Appcontext";

export default function Home() {
  const { backendUrl, isLoggedIn } = useContext(AppContext);
  console.log(backendUrl)
  console.log(isLoggedIn)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden">
          {/* Animated gradient background */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientMove 8s ease infinite'
            }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6 leading-tight">
                🚀 AutoApply
              </h1>
              <h2 className="text-xl sm:text-2xl font-medium text-gray-700 mb-8">
                Your <span className="text-blue-600 font-semibold">smart</span> job search assistant
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10 relative">

                <span className="absolute -left-6 top-2 text-4xl opacity-20">"</span>
                Discover top companies. Automate your applications. Land your dream role faster.
                <span className="absolute -right-6 bottom-2 text-4xl opacity-20">"</span>

              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link

                  to={isLoggedIn ? "/profile" : "/login"}
                  className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="relative z-10">
                    {isLoggedIn ? "Go to Profile" : "Get Started — It's Free"}
                  </span>

                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
                <Link
                  to="/search"
                  className="relative overflow-hidden group bg-white text-gray-800 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                >
                  <span className="relative z-10">Explore Jobs</span>
                  <span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 sm:py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                ✨ How it works
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🔍",
                  title: "Smart Search",
                  desc: "Find top jobs across multiple platforms with one search"
                },
                {
                  icon: "⚡",
                  title: "1-Click Apply",
                  desc: "Use pre-saved profiles for lightning-fast applications"
                },
                {
                  icon: "📊",
                  title: "Track Progress",
                  desc: "Monitor all your applications in one dashboard"
                },
                {
                  icon: "❤️",
                  title: "Save Favorites",
                  desc: "Bookmark interesting jobs for later consideration"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 hover:border-blue-100"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to transform your job search?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students and professionals who found their dream roles with AutoApply
            </p>
            <Link
              to={isLoggedIn ? "/dashboard" : "/signup"}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              {isLoggedIn ? "Go to Dashboard" : "Create Free Account"}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-medium">🚀 AutoApply</p>
              <p className="text-sm text-blue-200 mt-1">
                &copy; {new Date().getFullYear()} All rights reserved
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="https://github.com/Vedansh-017" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">
                GitHub
              </a>
              <Link to="/about" className="hover:text-blue-300 transition-colors">
                About
              </Link>
              <Link to="/contact" className="hover:text-blue-300 transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="hover:text-blue-300 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-blue-300 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}