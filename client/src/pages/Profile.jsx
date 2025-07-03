// src/pages/Profile.jsx
import React, { useState, useContext } from "react";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

// ✅ Fix for Vite: use CDN for the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


export default function Profile() {
  const { backendUrl } = useContext(AppContext);

  const [resumeText, setResumeText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      toast.warning("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const { data } = await axios.post(`${backendUrl}/api/profile/upload-resume`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        const { name, email, skills, resumeText } = data.profile;
        setName(name);
        setEmail(email);
        setSkills(skills);
        setResumeText(resumeText);
        toast.success("Resume uploaded and profile extracted!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Error uploading resume");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📄 Upload Resume (PDF)</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      {resumeText && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mt-6">
          <div>
            <label className="block font-semibold mb-1">👤 Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block font-semibold mb-1">💼 Skills</label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="border p-2 w-full rounded h-20"
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block font-semibold mb-1">📃 Full Resume Text</label>
            <textarea
              readOnly
              value={resumeText}
              className="border p-2 w-full rounded h-40 bg-gray-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}
