import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';
import Forbidden from '../Components/Logo/Forbidden/Forbidden';

const AdminRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isLoading: roleLoading } = useRole();

    if (loading || roleLoading) {
        return <h2>Loading...</h2>;
    }

    // If user is NOT admin → Block access
    if (!user || role !== 'admin') {
        return <Forbidden />;
    }

    // If admin → Allow access
    return children;
};

export default AdminRoutes;
