import styled, { css } from 'styled-components/native';
import { Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Form as Unform } from '@unform/mobile';

export const Container = styled.View`
    height: 100%;
    width: 100%;
    padding: 0 30px;
`;

export const CarouselContainer = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
`;

export const NextContainer = styled(RectButton)`
    background-color: ${(props) => props.theme.colors.secundary};
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    margin-left: 10px;
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-top: 60px;
    height: 100px;
`;

export const WithDrawContainer = styled.View`
    z-index: 10;
`;

export const MenuContainer = styled(RectButton)`
    width: 48px;
    height: 48px;
    border-radius: 24px;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.secundary};
`;
export const Title = styled.Text`
    text-align: left;
    color: ${(props) => props.theme.colors.text};
    font-family: ${(props) => props.theme.text.bold};
    font-size: 28px;
    margin-left: 30px;
`;

export const WalletContainer = styled(RectButton)`
    width: 100%;
    flex-direction: row;
    align-items: center;
`;
export const Coin = styled.Text`
    font-family: ${(props) => props.theme.text.bold};
    font-size: 36px;
    color: ${(props) => props.theme.colors.secundary};
`;
export const WalletValue = styled.Text`
    font-family: ${(props) => props.theme.text.light};
    margin-left: 5px;
    font-size: 36px;
    color: ${(props) => props.theme.colors.secundary};
`;

export const Illustration = styled(Image)`
    position: absolute;
    bottom: 0;
    right: 0;
`;

export const BankCard = styled(RectButton)`
    background-color: ${(props) => props.background};
    width: 80%;
    height: 60px;
    border-radius: 12px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    position: relative;
    z-index: 1;
`;

export const AccountContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
export const Name = styled.Text`
    color: ${(props) => props.theme.colors.button};
    font-family: ${(props) => props.theme.text.bold};
    margin-left: 10px;
    font-size: 18px;
`;

export const WithdrawContainer = styled(RectButton)`
    background-color: ${(props) => props.theme.colors.primary};
    width: 36px;
    height: 36px;
    border-radius: 18px;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 20px;
`;

export const AddContainer = styled(RectButton)`
    background-color: ${(props) => props.theme.colors.secundary};
    width: 48px;
    height: 48px;
    border-radius: 24px;
    position: absolute;
    left: 30px;
    bottom: 30px;
    justify-content: center;
    align-items: center;
`;

export const FormTitle = styled.Text`
    font-size: 22px;
    font-family: ${(props) => props.theme.text.bold};
    color: ${(props) => props.theme.colors.secundary};
`;

export const Form = styled(Unform)`
    width: 100%;
    margin-top: 20px;
`;

export const FormContainer = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
`;

export const CarouselAlign = styled.View`
    margin: 30px 0;
`;
