import axios from "axios";

export const fetchJobs = async (req, res) => {
  try {
    console.log("📥 Incoming request to /api/external/jobs");
    console.log("📦 Request Body:", req.body);
    console.log("🔑 RAPIDAPI_KEY Loaded:", !!process.env.RAPIDAPI_KEY);

    const {
      search_term = "web",
      location = "india",
      results_wanted = 10,
      job_type = "fulltime",
      site_name = "indeed,linkedin,glassdoor", // string, not array
      distance = 50,
      is_remote = false,
      linkedin_fetch_description = false,
      hours_old = 72
    } = req.body;

    const response = await axios.post(
      'https://jobs-search-api.p.rapidapi.com/getjobs',
      {
        search_term,
        location,
        results_wanted,
        site_name,
        distance,
        job_type,
        is_remote,
        linkedin_fetch_description,
        hours_old
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jobs-search-api.p.rapidapi.com'
        }
      }
    );

    console.log("✅ API response received successfully");
    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Jobs API Error:", {
      status: error?.response?.status,
      data: error?.response?.data,
      headers: error?.response?.headers,
      message: error.message,
    });

    res.status(500).json({ 
      error: "Failed to fetch jobs from API", 
      details: error?.response?.data || error.message 
    });
  }
};
