import React, { useCallback } from 'react';

import { useEffect, useState } from 'react/cjs/react.development';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthProvider } from './auth';
import { NotificationProvider } from './notification';
import { LoadingProvider } from './loading';
import { SocketProvider } from './socket';
import { OrderProvider } from './order';

const AppProvider = ({ children }) => {
    const [key, setKey] = useState(null);
    const getKey = useCallback(async () => {
        const access_token = await AsyncStorage.getItem('access_token');
        return setKey(access_token);
    }, []);

    useEffect(() => {
        getKey();
    }, []);
    return (
        <AuthProvider>
            {key && (
                <NotificationProvider>
                    <OrderProvider>
                        <SocketProvider token={key}>
                            <LoadingProvider>{children}</LoadingProvider>
                        </SocketProvider>
                    </OrderProvider>
                </NotificationProvider>
            )}
        </AuthProvider>
    );
};

export default AppProvider;
