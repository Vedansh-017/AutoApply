// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { backendUrl, userData, isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContext);
  const [resume, setResume] = useState("");
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/login");
  };

  const getResume = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/profile/get`, { withCredentials: true });
      setResume(data.resume || "No resume found.");
    } catch (err) {
      console.error("Error fetching resume");
    }
  };

  const getApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/apply/all`, { withCredentials: true });
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Error fetching applications");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getResume();
      getApplications();
    }
  }, [isLoggedIn]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {userData?.name || "User"} 👋</h2>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">📄 Saved Resume</h3>
        <div className="p-4 border bg-gray-50 rounded whitespace-pre-wrap">{resume}</div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">📬 Applied Jobs</h3>
        {applications.length === 0 ? (
          <p className="text-gray-600">No jobs applied yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app, idx) => (
              <li key={idx} className="border p-4 rounded">
                <a
                  href={app.job?.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-semibold text-lg"
                >
                  {app.job?.title}
                </a>
                <p className="text-gray-500">{app.job?.company}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
