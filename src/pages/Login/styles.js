import styled from 'styled-components/native';

import { Form as Unform } from '@unform/mobile';

import LogoImg from 'assets/logo.svg';
import CycleImg from 'assets/cycle.svg';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    background-color: ${(props) => props.theme.colors.background};
`;
export const Logo = styled(LogoImg)`
    margin-top: 40px;
`;
export const Cycle = styled(CycleImg)`
    margin-top: 30px;
`;

export const Form = styled(Unform)`
    margin-top: 30px;
    width: 100%;
`;

export const ChoiceText = styled.Text`
    margin-top: 20px;
    font-size: 24px;
    color: ${(props) => props.theme.colors.text};
    font-family: ${(props) => props.theme.text.medium};
    text-align: center;
`;
