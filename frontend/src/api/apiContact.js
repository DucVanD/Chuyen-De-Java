import axiosInstance from "./axios";

const apiContact = {
    getAll: async () => {
        const res = await axiosInstance.get("/contacts");
        return res.data;
    },
    getById: async (id) => {
        const res = await axiosInstance.get(`/contacts/${id}`);
        return res.data;
    },
    update: async (id, data) => {
        const res = await axiosInstance.put(`/contacts/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await axiosInstance.delete(`/contacts/${id}`);
        return res.data;
    }
};

export default apiContact;
