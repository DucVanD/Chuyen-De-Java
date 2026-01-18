import axiosInstance from "./axios";

const apiChat = {
    sendMessage: async (message, history = []) => {
        const res = await axiosInstance.post("/chat", {
            message,
            history,
        });
        return res.data;
    },
};

export default apiChat;
