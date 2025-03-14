let URLbaseAPI = "http://127.0.0.1:8000/api";

if (process.env.NODE_ENV === "production") {
  URLbaseAPI = "https://softsuite-backend-b.vercel.app/api";
}

module.exports = URLbaseAPI;
