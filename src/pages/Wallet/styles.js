import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { Form as Unform } from '@unform/mobile';

import Image from 'assets/wallet.svg';

export const Container = styled.View`
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 30px;
`;

export const ContentContainer = styled.View`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const FormContainer = styled.View`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: rgba(63, 61, 86, 0.5);
`;
