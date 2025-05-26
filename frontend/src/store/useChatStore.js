import { create } from "zustand"
import { axiosInstace } from "../lib/axios"
import toast from "react-hot-toast"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstace.get("/messages/users")
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstace.get(`/messages/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstace.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.log("Error in sendMesage funtion in useChatStore - ", error.message);
            toast.error(error.response.data.message)
        }
    },

    // todo : Optimize this one later
    setSelectedUser: (selectedUser) => set({ selectedUser })
}))