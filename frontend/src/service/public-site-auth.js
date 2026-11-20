import { api } from "../libs/api";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const authService = {

    // ===============Register==============

    async register ({
        name, email, password
    }) {

        const response = await api.post('/register', {

            name: name.trim(),
            email: email.trim(),
            password,
            password_confirmation: password
        });

        return response.data;

    },

    async login ({email, password}) {

        const response = await api.post('/login', {

            email: email.trim(),
            password,
        });

        return response.data;
    },

    async getCurrentuser() {

        const response = await api.get('/user');
        return response.data;
    },

    // ============For redirect to oauth service============

    redirectToSocialProvider(provider, redirectTo = '/') {

        sessionStorage.setItem('auth_redirect', redirectTo);
        window.location.href = `${API_URL}/auth/${provider}/redirect`;
    }
}