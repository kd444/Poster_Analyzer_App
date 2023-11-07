import Axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";

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

    async getReport() {
        const response = await Axios.get(`${BASE_URL}get-report/`);
        return response.data;
    },
    async downloadPDFReport() {
        const response = await Axios.get(`${BASE_URL}generate_pdf_report/`, {
            responseType: "blob",
        });
        return response.data;
    },
};

export default api;
