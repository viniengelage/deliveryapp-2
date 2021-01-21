import styled, { css } from 'styled-components/native';
import IoIcons from 'react-native-ionicons';

export const Container = styled.View`
    width: 100%;
    height: 60px;
    padding: 0 16px;
    background: ${(props) => props.theme.colors.background};
    border-radius: 10px;
    margin-top: 8px;
    border-width: 2px;
    border-color: ${(props) => props.theme.colors.secundary};

    flex-direction: row;
    align-items: center;

    text-shadow: 10px 5px;

    ${(props) =>
        props.isErrored &&
        css`
            border-color: ${props.theme.colors.error};
        `}

    ${(props) =>
        props.isFocused &&
        css`
            border-color: ${props.theme.colors.primary};
        `}

            ${(props) =>
        props.isFilled &&
        css`
            border-color: ${props.theme.colors.primary};
        `}
`;

export const Icon = styled(IoIcons)`
    margin-right: 10px;
`;

export const TextInput = styled.TextInput`
    flex: 1;
    font-size: 16px;
    font-family: ${(props) => props.theme.text.medium};
`;

export const ErrorText = styled.Text`
    margin-top: 0;
    color: #c53030;
    font-family: ${(props) => props.theme.text.medium};
    margin-left: 3px;
`;
