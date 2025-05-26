import { create } from "zustand"
import { axiosInstace } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstace.get("/auth/check");
            set({ authUser: res.data })
        } catch (error) {
            set({ authUser: null })
            console.log("Error in checkAuth function from useAuthStore - ", error.message);
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstace.post("/auth/signup", data)
            toast.success("Account created successfully")
            set({ authUser: res.data })
        } catch (error) {
            toast.error(error.message)
            console.log("Error in signup function from useAuthStore - ", error.message);
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstace.post("/auth/logout")
            set({ authUser: null })
        } catch (error) {
            toast.error(error.message)
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstace.post("/auth/login", data)
            toast.success("Login successfully")
            set({ authUser: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in login function from useAuthStore - ", error.message);
        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstace.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in updateProfile function from useAuthStore - ", error.message);
        } finally {
            set({ isUpdatingProfile: false })
        }
    }
}))