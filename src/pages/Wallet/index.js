import React, { useEffect, useCallback, useState } from 'react';
import { Modal } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-ionicons';

import Button from 'components/Button';
import Input from 'components/InputBasic';

import { transactions } from 'services/api';

import {
    Container,
    Illustration,
    Header,
    MenuContainer,
    Title,
    WalletContainer,
    Coin,
    WalletValue,
    BankCard,
    Name,
    WithdrawContainer,
    AddContainer,
} from './styles';

const Wallet = () => {
    const [balance, setBalance] = useState(0);

    const navigation = useNavigation();
    const { colors } = useTheme();

    const getWallet = useCallback(async () => {
        const response = await transactions.get('/wallets');
        setBalance(response.data.data.balance);
    }, []);

    useEffect(() => {
        getWallet();
    }, [getWallet]);

    return (
        <>
            <Container>
                <Header>
                    <MenuContainer onPress={() => navigation.openDrawer()}>
                        <Icon name="menu" color={colors.background} />
                    </MenuContainer>
                    <Title>Sua carteira</Title>
                </Header>
                <WalletContainer>
                    <Coin>R$</Coin>
                    <WalletValue>{balance && balance}</WalletValue>
                </WalletContainer>
                <BankCard>
                    <Icon name="wallet" color={colors.background} />
                    <Name>Nubank</Name>
                    <WithdrawContainer>
                        <Icon name="cash" color={colors.background} size={24} />
                    </WithdrawContainer>
                </BankCard>

                <AddContainer onPress={() => setVisibleCreateAccount(true)}>
                    <Icon name="add" color={colors.background} size={36} />
                </AddContainer>
                <Illustration width={200} />
            </Container>
        </>
    );
};
export default Wallet;
