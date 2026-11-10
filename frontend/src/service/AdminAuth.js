import { api } from "./api";

export const loginAdmin = async (credentials) => {

    const response = await api.post("http://127.0.0.1:8000/api/register", credentials);

    return response.data;
}






