import styled, { css } from 'styled-components/native';
import { Form as Unform } from '@unform/mobile';

import ButtonComponent from 'components/Button';
import NotificationImg from 'assets/notification.svg';
import RunningImg from 'assets/running.svg';
import DetailImg from 'assets/next.svg';

export const Background = styled.View`
    background: rgba(63, 61, 86, 0.5);
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 20px;
`;

export const CurrencyContainer = styled.View`
    background: rgba(63, 61, 86, 0.5);
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    justify-content: center;
    align-items: center;
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
            height: 160px;
            width: 320px;
        `}
    ${(props) =>
        props.extract &&
        css`
            border: none;
            border-radius: 0;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            bottom: 0;
            height: 170px;
            width: 320px;
        `}
        ${(props) =>
        props.currency &&
        css`
            padding: 20px;
            width: 100%;
            height: 300px;
        `}
`;

export const ButtonContainer = styled.View``;
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
            margin-top: 10px;
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

        ${(props) =>
        props.extract &&
        css`
            margin-top: 20px;
            margin-left: 20px;
            margin-bottom: 5px;
        `}
        ${(props) =>
        props.currency &&
        css`
            text-align: center;
        `}
`;

export const Description = styled.Text`
    font-size: 14px;
    font-family: ${(props) => props.theme.text.medium};
    color: ${(props) => props.theme.colors.primary};
    text-align: left;
    text-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
    margin-left: 20px;
    width: 60%;
    margin-bottom: 5px;
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
export const DetailSvg = styled(DetailImg)`
    position: absolute;
    bottom: -19px;
    right: 2px;
`;

export const Form = styled(Unform)`
    width: 100%;
`;
