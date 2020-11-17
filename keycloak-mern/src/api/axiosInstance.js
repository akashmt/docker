import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    config => {
        const token = window.accessToken ? window.accessToken : 'dumy_token';
        config.headers['Authorization'] = 'Bearer ' + token;
        return config;
    },
    error=>{
        return Promise.reject(error);
    });

axiosInstance.interceptors.response.use((response) => {
    return response;
}, function(error) {
    return Promise.reject(error);
});

export default axiosInstance;