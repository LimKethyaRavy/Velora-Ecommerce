import axios, { Axios } from "axios";

const API_URL = 'http://127.0.0.1:8000/api/product';


export const getProduct = async(params = {}) => {

    const response = await axios.get(`${API_URL}/all`, {
        params,
    })

    return response.data;

}

export const createProduct = async(product) => {

    const response = await axios.post(`${API_URL}/create`, product);

    return response.data;
}

export const showProduct = async(id, product) => {

    const response = await axios.get(`${API_URL}/${id}`, product)

    return response.data
}

export const updateProduct = async(id, product) => {

   const response = await axios.post(
    `${API_URL}/update/${id}`,
    product, {
        headers: {

            "Content-Type": "multipart/form-data"

        }, 
        params: {
            _method: "PUT",
        },
    }
   );

   return response.data;
} 


export const deleteProduct = async(id, product) => {

    const response = await axios.delete(`${API_URL}/delete/${id}`, product);

    return response.data;
}