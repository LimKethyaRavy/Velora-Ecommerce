import axios, { Axios } from "axios";

const API_URL = 'http://127.0.0.1:8000/api/products';


export const getProduct = async() => {

    const response = await axios.get(`${API_URL}/all`)

    return response.data;

}

export const createProdcut = async(product) => {

    const response = await axios.put(`${API_URL}/create`, product);

    return response.data;
}

export const showProduct = async(id, product) => {

    const response = await axios.get(`${API_URL}/show/${id}`, product)

    return response.data
}

export const updateProduct = async(id, product) => {

    const response = await axios.put(`${API_URL}/update/${id}`, product);

    return response.data;
} 


export const deleteProdcut = async(id, product) => {

    const response = await axios.delete(`${API_URL}/delete/${id}`, product);

    return response.data;
}