import { api } from "../libs/api";

export const loginAdmin = async (credentials) => {

    const response = await api.post("/login", credentials);

    return response.data;
}






