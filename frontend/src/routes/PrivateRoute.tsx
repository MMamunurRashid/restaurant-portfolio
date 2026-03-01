import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch } from '@/redux/hook/hooks';
import { userLogout } from '@/redux/features/user/authSlice';
import { useEffect } from 'react';

const isTokenExpired = (token: string) => {
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.log('Error decoding token:', error);
        return true;
    }
};

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { token } = useSelector((state: any) => state.auth);
    const location = useLocation();
    const dispatch = useAppDispatch();

    const tokenExpired = token ? isTokenExpired(token) : true;


    useEffect(() => {
        if (token && tokenExpired) {
            dispatch(userLogout());
        }
    }, [token, tokenExpired, dispatch]);

    if (!token || tokenExpired) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};