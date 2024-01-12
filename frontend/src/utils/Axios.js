import axios from "axios";

// Creating an instance of axios with a base URL
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
});

// Function to get request Cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Function to get basic token from local storage
function getBasicToken() {

  let basic_access_token = localStorage.getItem("access_token");
  const access_token = "Basic " + basic_access_token;

  if (basic_access_token) { return access_token; }
  else {
    return null;
  }
}
// configration of axios required request headers

api.interceptors.request.use(
  (config) => {
    const tmpConfig = config;
    tmpConfig.withCredentials = true;
    tmpConfig.crossDomain = true;
    tmpConfig.defaults = {};
    tmpConfig.defaults.withCredentials = true;
    tmpConfig.headers.Authorization = getBasicToken();
    tmpConfig.headers["X-CSRFToken"] = getCookie("csrftoken");
    return tmpConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// api.interceptors.response.use(
//   (response) => {
//     console.log("resresresresresres",response)
//     if (response.status === 403) {
//       window.location.href = process.env.REACT_APP_LOGIN_REDIRECT_URL;
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       window.location.href = process.env.REACT_APP_LOGIN_REDIRECT_URL;
//     }

//     return Promise.reject(error);
//   }
// );
export default api;