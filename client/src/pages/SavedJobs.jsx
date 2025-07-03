import React, { useEffect, useState } from "react";

export default function SavedJobs() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">⭐ Saved Jobs</h2>
      {favorites.length === 0 ? (
        <p>You haven’t shortlisted any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((job, idx) => (
            <li key={idx} className="border p-4 rounded">
              <a
                href={job.job_url}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-semibold text-blue-600"
              >
                {job.title}
              </a>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-600">{job.location || "Location not specified"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
