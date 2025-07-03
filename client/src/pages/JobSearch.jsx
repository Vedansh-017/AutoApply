import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function JobSearch() {
  const { backendUrl, isLoggedIn } = useContext(AppContext);
  const [query, setQuery] = useState("frontend");
  const [location, setLocation] = useState("Mumbai");
  const [jobType, setJobType] = useState("all");
  const [isRemote, setIsRemote] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/external/jobs`,
        {
          search_term: query,
          location,
          results_wanted: 10,
          site_name: ["linkedin", "indeed", "glassdoor"],
          distance: 50,
          job_type: jobType === "all" ? "" : jobType,
          is_remote: isRemote,
          hours_old: 72,
          page,
        },
        { withCredentials: true }
      );
      setJobs(data.jobs || []);
    } catch (err) {
      toast.error("Error fetching jobs: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleFavorite = (job) => {
    const updatedFavorites = favorites.some(j => j.id === job.id)
      ? favorites.filter(j => j.id !== job.id)
      : [...favorites, job];
    
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success(updatedFavorites.some(j => j.id === job.id) 
      ? "Job saved to favorites" 
      : "Removed from favorites");
  };

  const isFavorite = (job) => favorites.some((j) => j.id === job.id);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Job Search
          </h2>
          <p className="text-gray-600">Find your dream job from top platforms</p>
        </div>

        {/* Login Alert */}
        {!isLoggedIn && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-2 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              <span>You must be logged in to apply for jobs</span>
            </div>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Login Now
            </Link>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              >
                <option value="all">All Types</option>
                <option value="fulltime">Full-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="remote-checkbox"
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remote-checkbox" className="ml-2 block text-sm text-gray-700">
                Remote Only
              </label>
            </div>
            <button
              onClick={() => {
                setPage(1);
                fetchJobs();
              }}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Jobs
                </>
              )}
            </button>
          </div>
        </div>

        {/* Job Results */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">No jobs found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search filters</p>
            <button
              onClick={() => {
                setQuery("");
                setLocation("");
                setJobType("all");
                setIsRemote(false);
                setPage(1);
                fetchJobs();
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </a>
                    <p className="text-gray-600 mt-1">
                      {job.company} • {job.location || "Location not specified"}
                    </p>
                    {job.salary && (
                      <p className="text-green-600 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.salary}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(job)}
                    className={`self-start p-2 rounded-full ${isFavorite(job) ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
                    aria-label={isFavorite(job) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite(job) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isFavorite(job) ? 0 : 2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleApply(job.job_url)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center"
                    disabled={!isLoggedIn}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Apply Now
                  </button>
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {jobs.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              disabled={page === 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className={`flex items-center px-4 py-2 rounded-lg ${page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-gray-700">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-lg ${isLoading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"}`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}