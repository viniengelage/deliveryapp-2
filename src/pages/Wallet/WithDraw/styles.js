import styled from 'styled-components/native';
import { Form as Unform } from '@unform/mobile';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background: rgba(63, 61, 86, 0.5);
    height: 100%;
    width: 100%;
    position: absolute;
`;

export const ContentContainer = styled.View`
    background-color: ${(props) => props.theme.colors.secundary};
    width: 80%;
    height: 260px;
    padding: 0 30px;
    justify-content: center;
    border-radius: 12px;
    align-items: center;
`;
export const Title = styled.Text`
    color: ${(props) => props.theme.colors.button};
    font-family: ${(props) => props.theme.text.medium};
    font-size: 18px;
    text-align: center;
    margin-bottom: 10px;
`;
export const Form = styled(Unform)`
    width: 100%;
`;
