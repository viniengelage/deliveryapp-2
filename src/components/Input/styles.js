import styled, { css } from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
`;

export const Icon = styled(FontAwesome5)`
    margin-right: 10px;
    color: ${(props) => props.theme.colors.text};
`;

export const ErrorText = styled.Text`
    margin-top: 0;
    color: #c53030;
    font-family: ${(props) => props.theme.text.medium};
    margin-left: 3px;
`;
