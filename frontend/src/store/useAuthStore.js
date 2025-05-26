import { create } from "zustand"
import { axiosInstace } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstace.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();

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
            set({ authUser: res.data });

            get().connectSocket();
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
            get().disconnectSocket();
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

            // Socket.io
            get().connectSocket();
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
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket: socket });
        // "getOnlineUsers" event is created using emit in the backend and we can use that method on the socket and can receive the data 
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }
}))