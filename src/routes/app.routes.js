import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet } from 'react-native';

import CustomDrawer from 'components/CustomDrawer';
import { SocketProvider } from 'hooks/socket';

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

const AuthRoutes = ({ token }) => {
    const { user, signOut } = useAuth();
    const { colors } = useTheme();

    return (
        <SocketProvider token={token}>
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
                        drawerIcon: () => (
                            <Icon
                                name="home"
                                size={24}
                                color={colors.background}
                                style={styles.icon}
                                light
                            />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Wallet"
                    component={Wallet}
                    options={{
                        title: 'Carteira',
                        drawerIcon: () => (
                            <Icon
                                name="wallet"
                                size={24}
                                color={colors.background}
                                style={styles.icon}
                                light
                            />
                        ),
                    }}
                />
            </Drawer.Navigator>
        </SocketProvider>
    );
};

export default AuthRoutes;
