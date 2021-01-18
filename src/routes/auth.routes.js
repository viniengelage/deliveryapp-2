import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Init from 'pages/Init';
import Login from 'pages/Login';
import Register from 'pages/Register';
import Home from 'pages/Home';

const Auth = createStackNavigator();

const AuthRoutes = () => (
    <Auth.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Auth.Screen name="Init" component={Init} />
        <Auth.Screen name="Login" component={Login} />
        <Auth.Screen name="Register" component={Register} />
        <Auth.Screen name="Home" component={Home} />
    </Auth.Navigator>
);

export default AuthRoutes;
