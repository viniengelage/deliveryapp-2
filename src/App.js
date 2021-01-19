import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from 'routes/rootNavigation';

import AppProvider from 'hooks';

import pallet from 'styles/pallet';
import Routes from 'routes';

export default function App() {
    return (
        <NavigationContainer ref={navigationRef}>
            <ThemeProvider theme={pallet}>
                <AppProvider>
                    <Routes />
                    <StatusBar />
                </AppProvider>
            </ThemeProvider>
        </NavigationContainer>
    );
}
