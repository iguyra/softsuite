let URLbaseAPI = "http://127.0.0.1:8000/api";

if (process.env.NODE_ENV === "production") {
  URLbaseAPI = "https://my-spay.com/api";
}

module.exports = URLbaseAPI;
