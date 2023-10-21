import Axios from "axios";

const BASE_URL = "http://3.110.179.7:8000/api/";

const api = {
    async uploadPoster(file) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await Axios.post(
            `${BASE_URL}upload-poster/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    async startAnalysis() {
        const response = await Axios.post(`${BASE_URL}start-analysis/`);
        return response.data;
    },

    async getReport() {
        const response = await Axios.get(`${BASE_URL}get-report/`);
        return response.data;
    },
};

export default api;
