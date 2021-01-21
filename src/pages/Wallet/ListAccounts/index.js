import React, { useEffect } from 'react';
import { useTheme } from 'styled-components';
import Icon from 'react-native-ionicons';
import { useNavigation } from '@react-navigation/native';
import {
    Container,
    Header,
    MenuContainer,
    Title,
    WalletContainer,
    Coin,
    WalletValue,
    AddContainer,
} from './styles';

const ListAccounts = ({ balance, addAccount }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    useEffect(() => {
        console.log('Hello ListAccounts');
    }, []);

    return (
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
            <AddContainer onPress={() => addAccount(true)}>
                <Icon name="add" color={colors.background} />
            </AddContainer>
        </Container>
    );
};
export default ListAccounts;
