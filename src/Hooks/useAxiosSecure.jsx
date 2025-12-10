import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
});

const useAxiosSecure = () => {
    const { user } = useAuth();

    useEffect(() => {
        const interceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                if (user) {
                    const token = await user.getIdToken(); // MUST NEED
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axiosSecure.interceptors.request.eject(interceptor);
        };
    }, [user]);

    return axiosSecure;
};

export default useAxiosSecure;
