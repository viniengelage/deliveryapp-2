import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import defaultProfile from 'assets/profile.png';

import { useSocket } from 'hooks/socket';
import { useTheme } from 'styled-components';
import {
    Container,
    Avatar,
    AvatarContainer,
    AvatarName,
    LogoContainer,
    Logo,
    Switch,
} from './styles';

const CustomDrawer = ({ user, signOut, ...props }) => {
    const { isEnabled, toggleSwitch } = useSocket();
    const { colors, text } = useTheme();

    return (
        <Container>
            <LogoContainer>
                <Logo width={200} />
            </LogoContainer>
            <DrawerItemList
                {...props}
                activeTintColor={colors.button}
                activeBackgroundColor={colors.primary}
                inactiveTintColor={colors.button}
                inactiveBackgroundColor={colors.secundary}
                labelStyle={{
                    fontSize: 16,
                    fontFamily: text.bold,
                }}
            />
            <DrawerItem
                label="Receber entregas"
                onPress={() => signOut()}
                icon={() => (
                    <Switch value={isEnabled} onValueChange={toggleSwitch} />
                )}
                labelStyle={{
                    fontSize: 16,
                    fontFamily: text.bold,
                    color: '#fff',
                    marginLeft: -20,
                }}
                inactiveBackgroundColor={
                    isEnabled ? colors.sucess : colors.error
                }
            />
            <DrawerItem
                label="Sair"
                onPress={() => signOut()}
                icon={({ size }) => (
                    <Icon
                        name="log-out"
                        size={size}
                        color={colors.background}
                        style={{ marginLeft: 20 }}
                    />
                )}
                labelStyle={{
                    fontSize: 16,
                    fontFamily: text.bold,
                    color: '#fff',
                    marginLeft: -10,
                }}
                inactiveBackgroundColor={colors.secundary}
            />
            <AvatarContainer>
                <Avatar
                    source={user.img ? { uri: user.img } : defaultProfile}
                />
                <AvatarName>{user.name}</AvatarName>
            </AvatarContainer>
        </Container>
    );
};

export default CustomDrawer;
