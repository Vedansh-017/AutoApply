import axios from "axios";

export const fetchJobs = async (req, res) => {
  try {
    const {
      search_term = "web",
      location = "india",
      results_wanted = 10,
      job_type = "fulltime",
      site_name = ["indeed", "linkedin", "glassdoor"],
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Jobs API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch jobs from API" });
  }
};
