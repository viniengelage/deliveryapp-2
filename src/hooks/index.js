import React from 'react';

import { AuthProvider } from './auth';
import { NotificationProvider } from './notification';
import { LoadingProvider } from './loading';
import { OrderProvider } from './order';
import { LocationProvider } from './location';

const AppProvider = ({ children }) => (
    <AuthProvider>
        <NotificationProvider>
            <LocationProvider>
                <LoadingProvider>
                    <OrderProvider>{children}</OrderProvider>
                </LoadingProvider>
            </LocationProvider>
        </NotificationProvider>
    </AuthProvider>
);

export default AppProvider;
