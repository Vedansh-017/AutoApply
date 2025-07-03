// src/pages/JobSearch.jsx
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

  const [jobs, setJobs] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const fetchJobs = async () => {
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
      toast.error("Error fetching jobs");
    }
  };

  const handleApply = async (job) => {
    if (!isLoggedIn) {
      toast.warning("Please log in to apply.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/apply/submit`,
        { job },
        { withCredentials: true }
      );
      data.success ? toast.success("Applied successfully!") : toast.error("Apply failed.");
    } catch (err) {
      toast.error("Error applying for job");
    }
  };

  const toggleFavorite = (job) => {
    const updatedFavorites = [...favorites];
    const index = updatedFavorites.findIndex((j) => j.id === job.id);
    if (index === -1) {
      updatedFavorites.push(job);
      toast.success("Job shortlisted");
    } else {
      updatedFavorites.splice(index, 1);
      toast.info("Removed from shortlist");
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🔍 Job Search</h2>

      {/* Login Alert */}
      {!isLoggedIn && (
        <div className="mb-6 bg-yellow-100 text-yellow-900 p-4 rounded flex justify-between items-center">
          <span>🔒 You must be logged in to apply for jobs.</span>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="border p-2 rounded w-full sm:w-auto"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border p-2 rounded w-full sm:w-auto"
        />
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Types</option>
          <option value="fulltime">Full-time</option>
          <option value="internship">Internship</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isRemote}
            onChange={(e) => setIsRemote(e.target.checked)}
          />
          Remote only
        </label>
        <button
          onClick={() => {
            setPage(1);
            fetchJobs();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Job Results */}
      {jobs.length === 0 ? (
        <p>No jobs found. Try adjusting filters.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <div key={idx} className="border p-4 rounded shadow">
              <a
                href={job.job_url}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-bold text-blue-700"
              >
                {job.title}
              </a>
              <p className="text-gray-600 text-sm">
                {job.company} | {job.location || "Location not specified"}
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleApply(job)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Apply
                </button>
                <button
                  onClick={() => toggleFavorite(job)}
                  className={`px-3 py-1 rounded border ${
                    isFavorite(job) ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                >
                  {isFavorite(job) ? "★ Saved" : "☆ Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex gap-4 justify-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          ⬅ Prev
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
