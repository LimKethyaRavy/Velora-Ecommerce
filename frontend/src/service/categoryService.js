import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/categories";

export const getCategory = async (params) => {
  const response = await axios.get(`${API_URL}/all`, { params });
  return response.data;
};

export const createCategory = async (category) => {
  const response = await axios.post(API_URL, category);
  return response.data;
};

export const updateCategory = async (id, category) => {
  const response = await axios.put(`${API_URL}/${id}`, category);
  return response.data;
};

export const showCategory = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};