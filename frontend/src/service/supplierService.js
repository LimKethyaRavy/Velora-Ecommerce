import axios, { Axios } from "axios";

const API_URL = 'http://127.0.0.1:8000/api/suppliers';

export const getSupplier = async() => {

    const response = await axios.get(`${API_URL}/all`);

    return response.data;
}

export const createSupplier = async(supplier) => {

    const response = await axios.post(`${API_URL}/create`, supplier);

    return response.data;

}

export const updateSupplier = async(id, supplier) => {

    const response = await axios.put(`${API_URL}/${id},supplier`, supplier);

    return response.data;
}

export const showSupplier = async(id) => {
    const response = await axios.get(`${API_URL}/show/${id}`);

    return response.data;
}

export const deleteSupplier = async(id) => {
    const response = await axios.delete(`${API_URL}/${id}`);

    return response.data;
}