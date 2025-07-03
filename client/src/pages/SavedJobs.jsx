import React, { useEffect, useState } from "react";
import { FiBookmark, FiExternalLink, FiSend, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

export default function SavedJobs() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const removeFavorite = (jobId) => {
    const updatedFavorites = favorites.filter(job => job.id !== jobId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success("Job removed from saved list");
  };

 const handleApply = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiBookmark className="text-yellow-500" />
          Saved Jobs
        </h2>
        {favorites.length > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {favorites.length} saved
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FiBookmark className="mx-auto text-3xl text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No saved jobs yet</h3>
          <p className="text-gray-500 mt-1">
            Save jobs you're interested in by clicking the bookmark icon
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600 flex items-center gap-1"
                    >
                      {job.title} <FiExternalLink className="text-sm" />
                    </a>
                    <p className="text-gray-600 mt-1">{job.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      {job.location && (
                        <span className="text-gray-500 flex items-center">
                          📍 {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="text-gray-500 flex items-center">
                          💰 {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFavorite(job.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Remove job"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {job.type && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                        {job.type}
                      </span>
                    )}
                    {job.posted && (
                      <span className="text-xs text-gray-500">
                        Posted {job.posted}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleApply(job.job_url)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiSend size={14} /> Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}