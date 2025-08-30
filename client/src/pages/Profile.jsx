import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FiSave,
  FiCheckCircle,
  FiLink,
  FiPhone,
  FiBook,
  FiAward,
  FiCode,
  FiEdit3,
} from "react-icons/fi";

export default function Profile() {
  const { userData, backendUrl } = useContext(AppContext);
  const [profileData, setProfileData] = useState({
    phone: "",
    college: "",
    github: "",
    linkedin: "",
    degree: "",
    graduationYear: "",
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // 🔹 toggle edit/view mode
  const [isSaved, setIsSaved] = useState(false);

  // 🔹 Load profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
          withCredentials: true,
        });

        if (data.success && data.profile) {
          setProfileData({
            ...data.profile,
            skills: data.profile.skills?.join(", ") || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [backendUrl]);

  // 🔹 Save profile data to backend
  const saveProfile = async () => {
    try {
      const payload = {
        ...profileData,
        skills: profileData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        payload,
        { withCredentials: true }
      );

      if (data.success) {
        setIsSaved(true);
        setEditMode(false); // 🔹 go back to view mode
        toast.success("Profile updated successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
        });

        setTimeout(() => setIsSaved(false), 3000);
      } else {
        toast.error(data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              {userData?.name?.charAt(0) || "U"}
            </div>
            <span>{userData?.name || "User"}'s Profile</span>
          </h2>
          <p className="text-gray-500 mt-2">{userData?.email}</p>
        </div>

        {/* 🔹 View Mode */}
        {!editMode ? (
          <div className="space-y-4">
            <InfoRow icon={<FiPhone />} label="Phone" value={profileData.phone} />
            <InfoRow icon={<FiBook />} label="College" value={profileData.college} />
            <InfoRow icon={<FiAward />} label="Degree" value={profileData.degree} />
            <InfoRow icon={<FiAward />} label="Graduation Year" value={profileData.graduationYear} />
            <InfoRow icon={<FiCode />} label="Skills" value={profileData.skills} />
            <InfoRow icon={<FiLink />} label="GitHub" value={profileData.github} link />
            <InfoRow icon={<FiLink />} label="LinkedIn" value={profileData.linkedin} link />

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-6 py-2 text-white font-medium rounded-lg bg-blue-500 hover:bg-blue-600"
              >
                <FiEdit3 /> Edit Profile
              </button>
            </div>
          </div>
        ) : (
          /* 🔹 Edit Mode */
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField icon={<FiPhone />} label="Phone Number" name="phone" value={profileData.phone} onChange={handleChange} placeholder="+91 9876543210" />
              <InputField icon={<FiBook />} label="College/University" name="college" value={profileData.college} onChange={handleChange} placeholder="Your college/university" />
              <InputField icon={<FiAward />} label="Degree Program" name="degree" value={profileData.degree} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" />
              <InputField icon={<FiAward />} label="Graduation Year" name="graduationYear" value={profileData.graduationYear} onChange={handleChange} placeholder="e.g. 2025" />
            </div>

            <InputField icon={<FiCode />} label="Skills" name="skills" value={profileData.skills} onChange={handleChange} placeholder="e.g. JavaScript, React, Node.js" />
            <p className="text-xs text-gray-500">Separate skills with commas</p>

            <InputField icon={<FiLink />} label="GitHub Profile" name="github" value={profileData.github} onChange={handleChange} placeholder="https://github.com/yourusername" />
            <InputField icon={<FiLink />} label="LinkedIn Profile" name="linkedin" value={profileData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" />

            <div className="flex justify-end pt-6 mt-4 border-t border-gray-100">
              <button
                onClick={saveProfile}
                className={`flex items-center gap-2 px-6 py-2 text-white font-medium rounded-lg transition-all ${
                  isSaved ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSaved ? <><FiCheckCircle /> Saved!</> : <><FiSave /> Save Profile</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Reusable Components */
function InputField({ icon, label, name, value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
  );
}

function InfoRow({ icon, label, value, link }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <span className="text-blue-500">{icon}</span>
      <span className="font-medium">{label}:</span>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}
