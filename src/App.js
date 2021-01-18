import 'react-native-gesture-handler';
import React, { useEffect, useCallback } from 'react';
import { StatusBar, PermissionsAndroid } from 'react-native';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';

import AppProvider from 'hooks';

import pallet from 'styles/pallet';
import Routes from 'routes';

export default function App() {
    const requestGpsPermission = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permita que possamos usar a localização',
                    buttonNegative: 'Não',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('daor');
            } else {
                requestGpsPermission();
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        requestGpsPermission();
    }, []);
    return (
        <NavigationContainer>
            <ThemeProvider theme={pallet}>
                <AppProvider>
                    <Routes />
                    <StatusBar />
                </AppProvider>
            </ThemeProvider>
        </NavigationContainer>
    );
}
