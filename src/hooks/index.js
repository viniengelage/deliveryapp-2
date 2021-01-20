import React, { useCallback } from 'react';

import { useEffect, useState } from 'react/cjs/react.development';
import AsyncStorage from '@react-native-community/async-storage';
import AuthRoutes from 'routes/auth.routes';
import { AuthProvider } from './auth';
import { NotificationProvider } from './notification';
import { LoadingProvider } from './loading';
import { SocketProvider } from './socket';
import { OrderProvider } from './order';

const AppProvider = ({ children }) => {
    const [key, setKey] = useState(null);
    const getKey = useCallback(async () => {
        const access_token = await AsyncStorage.getItem('access_token');
        if (!access_token) {
            return false;
        }
        setKey(access_token);
        return true;
    }, []);

    useEffect(() => {
        getKey();
    }, []);
    return (
        <AuthProvider>
            {getKey() ? (
                <NotificationProvider>
                    <LoadingProvider>
                        <OrderProvider>
                            <SocketProvider token={key}>
                                {children}
                            </SocketProvider>
                        </OrderProvider>
                    </LoadingProvider>
                </NotificationProvider>
            ) : (
                <AuthRoutes />
            )}
        </AuthProvider>
    );
};

export default AppProvider;
