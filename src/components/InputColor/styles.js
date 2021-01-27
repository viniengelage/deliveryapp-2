import styled, { css } from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const Container = styled.TouchableOpacity`
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

export const PickerContainer = styled.View`
    height: 100%;
    background: rgba(63, 61, 86, 0.5);
    justify-content: center;
    padding: 0 26px;
`;

export const TooltipContainer = styled.View`
    width: 100%;
    height: 80px;
    border-width: 3px;
    border-color: ${(props) => props.theme.colors.secundary};
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    box-shadow: 5px 3px 3px rgba(0, 0, 0, 0.25);
    background-color: ${(props) => props.theme.colors.background};
`;

export const TooltipText = styled.Text`
    color: ${(props) => props.theme.colors.secundary};
    font-family: ${(props) => props.theme.text.bold};
    width: 70%;
    text-align: center;
`;

export const Icon = styled(FontAwesome5)`
    margin-right: 10px;
`;

export const Color = styled(FontAwesome5)`
    margin-right: 10px;
`;

export const Placeholder = styled.Text`
    flex: 1;
    font-size: 16px;
    font-family: ${(props) => props.theme.text.bold};
`;

export const ErrorText = styled.Text`
    margin-top: 0;
    color: #c53030;
    font-family: ${(props) => props.theme.text.medium};
    margin-left: 3px;
`;
