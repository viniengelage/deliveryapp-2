import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { useTransition, animated } from 'react-spring';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { useNotification } from 'hooks/notification';

import { fadeIn } from 'utils/animations';
import WithDraw from '../WithDraw';

import {
    Container,
    Header,
    MenuContainer,
    Title,
    WalletContainer,
    Coin,
    WalletValue,
    AddContainer,
    BankCard,
    Name,
    AccountContainer,
    WithDrawContainer,
} from './styles';

const ListAccounts = ({ wallets, balance, addAccount, setVisible }) => {
    const { colors, shadow } = useTheme();
    const { createNotification, removeNotification } = useNotification();
    const navigation = useNavigation();

    const handleWithDraw = useCallback(() => {
        createNotification({
            type: 'push',
            withBackground: true,
            text: 'Gostaria de fazer uma retirada nesta conta?',
            buttonText: ['Vamos lá', 'Voltar'],
            buttonAction: [
                () => {
                    removeNotification();
                    createNotification({
                        type: 'currency',
                        withBackground: true,
                    });
                },
                () => {
                    removeNotification();
                },
            ],
        });
    }, []);

    return (
        <>
            <Container>
                <Header>
                    <MenuContainer onPress={() => navigation.openDrawer()}>
                        <Icon name="bars" color={colors.background} size={28} />
                    </MenuContainer>
                    <Title>Sua carteira</Title>
                </Header>
                <WalletContainer>
                    <Coin>R$</Coin>
                    <WalletValue>{balance && balance}</WalletValue>
                </WalletContainer>
                {wallets.lenght !== 0 &&
                    wallets.map(({ data: wallet }) => (
                        <BankCard
                            background={wallet.color}
                            style={shadow}
                            key={wallet.id}
                            onPress={() => handleWithDraw(wallet.id)}
                        >
                            <AccountContainer>
                                <Icon
                                    name="university"
                                    size={26}
                                    color={colors.button}
                                />
                                <Name>{wallet.name}</Name>
                            </AccountContainer>
                            <Icon
                                name="ellipsis-v"
                                size={26}
                                color={colors.button}
                            />
                        </BankCard>
                    ))}
                <AddContainer onPress={() => addAccount(true)}>
                    <Icon
                        name="chevron-right"
                        color={colors.background}
                        size={28}
                    />
                </AddContainer>
            </Container>
        </>
    );
};
export default ListAccounts;
