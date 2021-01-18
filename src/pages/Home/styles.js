import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    align-items: center;
    height: 100%;
`;

export const HeaderContainer = styled.View`
    width: 100%;
    padding: 0 30px;
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 60px;
    width: 100%;
`;

export const InfosContainer = styled.View`
    flex-direction: row;
`;
export const Bar = styled.View`
    width: 100%;
    height: 3px;
    border-radius: 6px;
    background-color: ${(props) => props.theme.colors.secundary};
`;
export const Title = styled.Text`
    font-size: 28px;
    font-family: ${(props) => props.theme.text.black};
    color: ${(props) => props.theme.colors.primary};
`;
export const Name = styled.Text`
    font-size: 28px;
    font-family: ${(props) => props.theme.text.light};
    color: ${(props) => props.theme.colors.secundary};
`;

export const IconContainer = styled(RectButton)`
    background-color: ${(props) => props.theme.colors.secundary};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 50px;
    height: 50px;
    border-radius: 25px;
`;
export const WalletContainer = styled.View`
    flex-direction: row;
`;
export const WalletValue = styled.Text`
    color: ${(props) => props.theme.colors.secundary};
    font-family: ${(props) => props.theme.text.light};
    font-size: 24px;
    margin-left: 5px;
`;
export const Wallet = styled.Text`
    color: ${(props) => props.theme.colors.secundary};
    font-family: ${(props) => props.theme.text.black};
    font-size: 24px;
`;
export const DateContainer = styled.View`
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;
export const Date = styled.Text`
    color: ${(props) => props.theme.colors.secundary};
    font-family: ${(props) => props.theme.text.medium};
`;
export const ChartContainer = styled.View`
    height: 30px;
    width: 100px;
    border-radius: 6px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    ${(props) =>
        props.isEnabled
            ? css`
                  background-color: ${props.theme.colors.sucess};
              `
            : css`
                  background-color: ${props.theme.colors.error};
              `}
`;
export const Percentage = styled.Text`
    margin-left: 5px;
    font-family: ${(props) => props.theme.text.regular};
    color: ${(props) => props.theme.colors.button};
`;

export const MapContainer = styled.View`
    width: 100%;
    height: 100%;
    margin-top: 30px;
    border-top-width: 6px;
    border-color: ${(props) => props.theme.colors.primary};
`;
