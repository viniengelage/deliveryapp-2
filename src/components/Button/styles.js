import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
    width: 100%;
    height: 60px;
    background-color: ${(props) => props.theme.colors.primary};
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    margin-top: 8px;

    ${(props) =>
        props.withoutBackground &&
        css`
            background-color: ${props.theme.colors.background};
        `}

    ${(props) =>
        props.notification &&
        css`
            background-color: ${props.theme.colors.secundary};
            width: 110px;
            height: 40px;
            margin-left: 20px;
        `}
`;
export const ButtonText = styled.Text`
    font-size: 22px;
    color: ${(props) => props.theme.colors.button};
    font-family: ${(props) => props.theme.text.medium};

    ${(props) =>
        props.withoutBackground &&
        css`
            color: ${props.theme.colors.text};
            font-family: ${props.theme.text.bold};
        `}

    ${(props) =>
        props.notification &&
        css`
            font-size: 14px;
        `}
`;
