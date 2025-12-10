import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isLoading:roleLoading, data } = useQuery({
        enabled: !!user?.email, // user না থাকলে query চলবে না
        queryKey: ['user-role', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}/role`);
            return res.data?.role || 'user';
        }
    });

    // যদি API role না দেয় তবে default 'user'
    const role = data?.role || 'user';

    return { role, roleLoading };
};

export default useRole;
