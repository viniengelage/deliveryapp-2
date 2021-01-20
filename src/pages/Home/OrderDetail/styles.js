import styled from 'styled-components/native';
import DetailImg from 'assets/detail.svg';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    background-color: ${(props) => props.theme.colors.background};
    border-radius: 12px;
    padding: 30px;
    width: 300px;
`;

export const Title = styled.Text`
    font-size: 18px;
    font-family: ${(props) => props.theme.text.bold};
    color: ${(props) => props.theme.colors.secundary};
    text-align: left;
    text-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
`;
export const Description = styled.Text`
    font-size: 14px;
    font-family: ${(props) => props.theme.text.medium};
    color: ${(props) => props.theme.colors.primary};
    text-align: left;
    text-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
`;
export const CloseContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 10px 0;
`;
export const ActionContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    width: 100%;
`;
export const FinalizeContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin: 10px 0;
`;
export const FinalizeButton = styled(RectButton)`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-color: ${(props) => props.theme.colors.secundary};

    justify-content: center;
    align-items: center;
`;
export const FinalizeText = styled.Text`
    font-size: 14px;
    font-family: ${(props) => props.theme.text.light};
    color: ${(props) => props.theme.colors.secundary};
    text-align: left;
    text-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
    margin-right: 10px;
`;

export const CloseButton = styled(RectButton)`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-color: ${(props) => props.theme.colors.secundary};

    justify-content: center;
    align-items: center;
`;
export const Detail = styled(DetailImg)``;
