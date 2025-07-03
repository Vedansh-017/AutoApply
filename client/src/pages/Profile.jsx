// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";
import { FiSave, FiCheckCircle, FiLink, FiPhone, FiBook, FiAward, FiCode } from "react-icons/fi";

export default function Profile() {
  const { userData } = useContext(AppContext);
  const [profileData, setProfileData] = useState({
    phone: "",
    college: "",
    github: "",
    linkedin: "",
    degree: "",
    graduationYear: "",
    skills: ""
  });
  const [isSaved, setIsSaved] = useState(false);

  // Load profile data from localStorage
  useEffect(() => {
    const localProfile = localStorage.getItem('profileData');
    if (localProfile) {
      setProfileData(JSON.parse(localProfile));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
    setIsSaved(true);
    toast.success("Profile saved !", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
    
    // Reset saved state after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              {userData?.name?.charAt(0) || "U"}
            </div>
            <span>{userData?.name || "User"}'s Profile</span>
          </h2>
          <p className="text-gray-500 mt-2">{userData?.email}</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiPhone className="text-gray-400" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiBook className="text-gray-400" />
                College/University
              </label>
              <input
                type="text"
                name="college"
                value={profileData.college}
                onChange={handleChange}
                placeholder="Your college/university"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiAward className="text-gray-400" />
                Degree Program
              </label>
              <input
                type="text"
                name="degree"
                value={profileData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiAward className="text-gray-400" />
                Graduation Year
              </label>
              <input
                type="text"
                name="graduationYear"
                value={profileData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2025"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiCode className="text-gray-400" />
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={profileData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="text-xs text-gray-500">Separate skills with commas</p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiLink className="text-gray-400" />
              GitHub Profile
            </label>
            <input
              type="url"
              name="github"
              value={profileData.github}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiLink className="text-gray-400" />
              LinkedIn Profile
            </label>
            <input
              type="url"
              name="linkedin"
              value={profileData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 mt-4 border-t border-gray-100">
          <button
            onClick={saveProfile}
            className={`flex items-center gap-2 px-6 py-2 text-white font-medium rounded-lg transition-all ${
              isSaved 
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSaved ? (
              <>
                <FiCheckCircle /> Saved!
              </>
            ) : (
              <>
                <FiSave /> Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}