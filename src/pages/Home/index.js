import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import Icon from 'react-native-ionicons';
import Spinner from 'react-native-spinkit';
import Geolocation from 'react-native-geolocation-service';

import { useAuth } from 'hooks/auth';

import Map from 'components/Map';
import Navigation from 'components/Navigation';

import { useNavigation } from '@react-navigation/native';
import { transactions } from 'services/api';
import { useOrder } from 'hooks/order';
import order from 'utils/order';
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
    OrderButton,
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
    const { newOrder, sellerLocation, initOrderStatus } = useOrder();

    const [userLocation, setUserLocation] = useState(null);
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
                <OrderButton onPress={() => newOrder(order, userLocation)}>
                    <Icon name="archive" size={32} />
                </OrderButton>
                <MapContainer>
                    <Navigation />
                </MapContainer>
            </Container>
        </>
    );
};

export default Home;
