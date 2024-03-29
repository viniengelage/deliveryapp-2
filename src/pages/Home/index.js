import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { useTransition, animated } from 'react-spring';
import dayjs from 'dayjs';
import br from 'dayjs/locale/pt-br';
import localeData from 'dayjs/plugin/localeData';
import { formatNumber } from 'react-native-currency-input';

import Icon from 'react-native-vector-icons/FontAwesome5';

import Map from 'components/Map';
import Navigation from 'components/Navigation';

import order from 'utils/order';
import { useAuth } from 'hooks/auth';
import { transactions } from 'services/api';
import { useOrder } from 'hooks/order';
import { fadeIn } from 'utils/animations';
import { useLocation } from 'hooks/location';
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

dayjs.locale(br);
dayjs.extend(localeData);

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
        destination,
        onRunning,
        currentOrder,
        deliveryState,
        onNavigation,
    } = useOrder();

    const { getPosition } = useLocation();

    const [userLocation, setUserLocation] = useState({});

    const AnimatedContainer = animated(View);

    const [visibleDetail, setVisibleDetail] = useState(false);
    const detailAnimation = useTransition(visibleDetail, null, fadeIn);

    const getWallet = useCallback(async () => {
        try {
            const response = await transactions.patch('/wallets');
            setBalance(
                formatNumber(response.data.data.balance, {
                    separator: ',',
                    precision: 2,
                    delimiter: '.',
                    ignoreNegative: true,
                })
            );
        } catch (error) {
            console.log(error.response.data);
        }
    }, []);

    useEffect(() => {
        getWallet();
        getPosition().then((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({
                latitude,
                longitude,
            });
        });
    }, []);

    return (
        <>
            {userLocation && onNavigation ? (
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
                                        order={deliveryState}
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
                                    <Icon
                                        name="bars"
                                        size={28}
                                        color="#fff"
                                        light
                                    />
                                </IconContainer>
                            </Header>
                            <WalletContainer>
                                <Wallet>R$</Wallet>
                                <WalletValue>{balance || 0}</WalletValue>
                            </WalletContainer>
                            <DateContainer>
                                <Date>
                                    {dayjs().format('DD')} de{' '}
                                    {dayjs().format('MMMM')} de{' '}
                                    {dayjs().format('YYYY')}
                                </Date>
                                <ChartContainer>
                                    <Icon
                                        name="chart-bar"
                                        color={colors.background}
                                        size={24}
                                    />
                                    <Percentage>4,05%</Percentage>
                                </ChartContainer>
                            </DateContainer>
                            <Bar />
                        </HeaderContainer>
                        <OrderButton
                            onPress={() => newOrder(order, userLocation)}
                        >
                            <Icon name="archive" size={32} />
                        </OrderButton>
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
