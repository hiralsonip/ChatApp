import axios from "axios"

export const axiosInstace = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://chatapp-z726.onrender.com/api",
    withCredentials: true
})