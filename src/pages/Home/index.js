import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { useTransition, animated } from 'react-spring';

import Icon from 'react-native-ionicons';

import Map from 'components/Map';
import Navigation from 'components/Navigation';

import order from 'utils/order';
import { useAuth } from 'hooks/auth';
import { transactions } from 'services/api';
import { useOrder } from 'hooks/order';
import { fadeIn } from 'utils/animations';
import OrderDetail from './OrderDetail';
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
    DetailContainer,
} from './styles';

const styles = StyleSheet.create({
    spinner: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detail: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
});

const Home = () => {
    const [balance, setBalance] = useState(0);
    const navigation = useNavigation();
    const { user } = useAuth();
    const { colors } = useTheme();
    const {
        newOrder,
        userLocation,
        destination,
        initOrderStatus,
        onRunning,
        currentOrder,
        orderState,
    } = useOrder();

    const AnimatedContainer = animated(View);

    const [visibleDetail, setVisibleDetail] = useState(false);
    const detailAnimation = useTransition(visibleDetail, null, fadeIn);

    const getWallet = useCallback(async () => {
        try {
            const response = await transactions.get('/wallets');
            setBalance(response.data.data.balance);
        } catch (error) {
            console.log(error.response.data);
        }
    }, []);

    useEffect(() => {
        getWallet();
    }, []);

    return (
        <>
            {userLocation && initOrderStatus ? (
                <>
                    <StatusBar
                        barStyle="light-content"
                        translucent={false}
                        backgroundColor="#38516f"
                    />
                    <Navigation
                        origin={userLocation}
                        destination={destination}
                    />
                    {onRunning && currentOrder && (
                        <DetailContainer
                            onPress={() => setVisibleDetail(!visibleDetail)}
                        >
                            <Icon name="cart" size={24} color={colors.button} />
                        </DetailContainer>
                    )}

                    {detailAnimation.map(
                        ({ item, key, props }) =>
                            item && (
                                <AnimatedContainer
                                    key={key}
                                    style={[props, styles.detail]}
                                >
                                    <OrderDetail
                                        order={orderState}
                                        close={() => setVisibleDetail(false)}
                                    />
                                </AnimatedContainer>
                            )
                    )}
                </>
            ) : (
                <>
                    <StatusBar
                        barStyle="dark-content"
                        translucent
                        backgroundColor="transparent"
                    />
                    <Container>
                        <HeaderContainer>
                            <Header>
                                <InfosContainer>
                                    <Title>Bem vindo, </Title>
                                    <Name>{user.name}</Name>
                                </InfosContainer>
                                <IconContainer
                                    onPress={() => navigation.openDrawer()}
                                >
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
                        {/* <OrderButton
                            onPress={() => newOrder(order, userLocation)}
                        >
                            <Icon name="archive" size={32} />
                        </OrderButton> */}
                        <MapContainer>
                            {userLocation && (
                                <Map userLocation={userLocation} />
                            )}
                        </MapContainer>
                    </Container>
                </>
            )}
        </>
    );
};

export default Home;
