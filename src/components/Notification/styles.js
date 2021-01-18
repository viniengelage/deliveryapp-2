import styled, { css } from 'styled-components/native';

import ButtonComponent from 'components/Button';
import NotificationImg from 'assets/notification.svg';
import RunningImg from 'assets/running.svg';

export const Background = styled.View`
    background: rgba(63, 61, 86, 0.5);
    position: absolute;
    width: 100%;
    height: 100%;
`;

export const Container = styled.View`
    width: 300px;
    height: 200px;
    border-width: 3px;
    border-color: ${(props) => props.theme.colors.secundary};
    border-radius: 12px;
    flex-direction: column;
    justify-content: flex-start;
    box-shadow: 5px 3px 3px rgba(0, 0, 0, 0.25);
    background-color: ${(props) => props.theme.colors.background};

    position: absolute;
    align-self: center;

    z-index: 1;

    ${(props) =>
        props.running &&
        css`
            border: none;
            border-radius: 0;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            bottom: 0;
        `}

    ${(props) =>
        props.push &&
        css`
            top: 40%;
        `}
`;

export const ButtonContainer = styled.View`
    ${(props) =>
        props.push &&
        css`
            flex-direction: row;
        `}
`;
export const Bar = styled.View`
    background-color: ${(props) => props.theme.colors.primary};
    width: 100%;
    height: 10px;
    position: absolute;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    top: 0;
`;

export const Button = styled(ButtonComponent)`
    ${(props) =>
        props.push &&
        css`
            margin-top: 30px;
        `}
`;
export const Title = styled.Text`
    width: 80%;
    font-size: 18px;
    color: ${(props) => props.theme.colors.text};
    font-family: ${(props) => props.theme.text.bold};
    margin: 20px;
    text-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);

    ${(props) =>
        props.running &&
        css`
            margin-bottom: 10px;
        `}

    ${(props) =>
        props.push &&
        css`
            width: 70%;
        `}
`;
export const NotificationSvg = styled(NotificationImg)`
    position: absolute;
    top: 10px;
    right: 2px;
`;
export const RunningSvg = styled(RunningImg)`
    position: absolute;
    bottom: 0;
    right: 2px;
`;
