import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-ionicons';
import { StyleSheet } from 'react-native';

import CustomDrawer from 'components/CustomDrawer';

import Home from 'pages/Home';
import Wallet from 'pages/Wallet';
import { useAuth } from 'hooks/auth';
import { useTheme } from 'styled-components';

const styles = StyleSheet.create({
    icon: {
        marginLeft: 15,
        padding: 0,
    },
});

const Drawer = createDrawerNavigator();

const AuthRoutes = () => {
    const { user, signOut } = useAuth();
    const { colors } = useTheme();

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => (
                <CustomDrawer user={user} {...props} signOut={signOut} />
            )}
            drawerStyle={{
                backgroundColor: colors.background,
            }}
        >
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{
                    title: 'Home',
                    drawerIcon: ({ size }) => (
                        <Icon
                            name="home"
                            size={size}
                            color={colors.background}
                            style={styles.icon}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="Wallet"
                component={Wallet}
                options={{
                    title: 'Carteira',
                    drawerIcon: ({ size }) => (
                        <Icon
                            name="wallet"
                            size={size}
                            color={colors.background}
                            style={styles.icon}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

export default AuthRoutes;
