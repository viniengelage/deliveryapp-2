import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
    LogoutContainer,
    LougoutText,
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
                label={isEnabled ? 'Recebendo pedidos' : 'Não recebendo'}
                onPress={toggleSwitch}
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
            <LogoutContainer onPress={() => signOut()}>
                <Icon
                    name="sign-out-alt"
                    size={24}
                    color={colors.secundary}
                    style={{ marginLeft: 20 }}
                    light
                />
                <LougoutText>Sair</LougoutText>
            </LogoutContainer>
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
