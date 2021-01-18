import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';

import AppProvider from 'hooks';

import pallet from 'styles/pallet';
import Routes from 'routes';

export default function App() {
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
