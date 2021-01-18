import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import Icon from 'react-native-ionicons';
import Spinner from 'react-native-spinkit';
import Geolocation from 'react-native-geolocation-service';

import { useAuth } from 'hooks/auth';

import Map from 'components/Map';

import { useNavigation } from '@react-navigation/native';
import { useSocket } from 'hooks/socket';
import { transactions } from 'services/api';
import {
    Container,
    Header,
    Title,
    Name,
    Wallet,
    Date,
    ChartContainer,
    Percentage,
    IconContainer,
    InfosContainer,
    Bar,
    DateContainer,
    MapContainer,
    HeaderContainer,
    WalletContainer,
    WalletValue,
} from './styles';

const styles = StyleSheet.create({
    spinner: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const Home = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { colors } = useTheme();
    const { socket } = useSocket();

    const [userLocation, setUserLocation] = useState({});
    const [balance, setBalance] = useState(0);

    const getWallet = useCallback(async () => {
        const response = await transactions.get('/wallets');
        setBalance(response.data.data.balance);
    }, []);

    const getPosition = useCallback(
        (options) =>
            new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(resolve, reject, options);
            }),
        []
    );

    useEffect(() => {
        getPosition().then((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({
                latitude,
                longitude,
            });
        });
        getWallet();
    }, []);

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <Container>
                <HeaderContainer>
                    <Header>
                        <InfosContainer>
                            <Title>Bem vindo, </Title>
                            <Name>{user.name}</Name>
                        </InfosContainer>
                        <IconContainer onPress={() => navigation.openDrawer()}>
                            <Icon name="menu" size={38} color="#fff" />
                        </IconContainer>
                    </Header>
                    <WalletContainer>
                        <Wallet>R$</Wallet>
                        <WalletValue>{balance || 0}</WalletValue>
                    </WalletContainer>
                    <DateContainer>
                        <Date>17 de janeiro de 2021</Date>
                        <ChartContainer>
                            <Icon
                                name="cellular"
                                color={colors.background}
                                size={24}
                            />
                            <Percentage>4,05%</Percentage>
                        </ChartContainer>
                    </DateContainer>
                    <Bar />
                </HeaderContainer>
                <MapContainer>
                    {userLocation ? (
                        <Map userLocation={userLocation} />
                    ) : (
                        <Spinner
                            isVisible
                            size={90}
                            color={colors.secundary}
                            type="Bounce"
                            style={styles.spinner}
                        />
                    )}
                </MapContainer>
            </Container>
        </>
    );
};

export default Home;
