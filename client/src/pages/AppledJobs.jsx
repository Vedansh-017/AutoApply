import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

export default function AppliedJobs() {
  const { backendUrl } = useContext(AppContext);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/apply/get`, {
        withCredentials: true,
      });
      if (data.success) setAppliedJobs(data.jobs);
      else toast.error("Failed to fetch applied jobs");
    } catch (err) {
      toast.error("Error loading applied jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📄 Applied Jobs</h2>
      {appliedJobs.length === 0 ? (
        <p className="text-gray-500">No jobs applied yet.</p>
      ) : (
        <div className="space-y-4">
          {appliedJobs.map((job, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg bg-white shadow-sm"
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <div className="text-sm text-gray-500">
                {job.location && <span>📍 {job.location} </span>}
                {job.salary && <span>💰 {job.salary} </span>}
              </div>
              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => window.open(job.job_url, "_blank")}
              >
                <FiSend /> View Job
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
