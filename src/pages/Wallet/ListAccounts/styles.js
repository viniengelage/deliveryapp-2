import styled from 'styled-components/native';
import { Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    height: 100%;
    width: 100%;
    padding: 0 30px;
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-top: 60px;
    height: 100px;
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

export const BankCard = styled.View`
    background-color: ${(props) => props.theme.colors.secundary};
    width: 100%;
    height: 60px;
    border-radius: 12px;
    flex-direction: row;
    align-items: center;
    padding: 0 30px;
    margin-top: 30px;
    position: relative;
`;
export const Name = styled.Text`
    color: ${(props) => props.theme.colors.button};
    font-family: ${(props) => props.theme.text.medium};
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