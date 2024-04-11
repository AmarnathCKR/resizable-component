import axios from "axios";

const API = axios.create({
    baseURL: "https://localhost:8443/api/v1/",
});



export const getAnyApi = (link) =>
    API.get(`${link}`, {
        headers: {
            "Content-Type": "application/json",   
        },
    });



export const PostAnyApi = (link, input) => API.post(`${link}`, input);
