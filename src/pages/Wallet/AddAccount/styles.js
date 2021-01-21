import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { Form as Unform } from '@unform/mobile';
import { Picker as RNPicker } from '@react-native-picker/picker';

export const Container = styled.View`
    height: 100%;
    width: 100%;
    padding: 0 30px;
`;
export const GoBackContainer = styled(RectButton)`
    background-color: ${(props) => props.theme.colors.secundary};
    width: 48px;
    height: 48px;
    border-radius: 24px;
    position: absolute;
    left: 30px;
    bottom: 30px;
    justify-content: center;
    align-items: center;
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-top: 60px;
    height: 100px;
`;
export const MenuContainer = styled(RectButton)`
    width: 48px;
    height: 48px;
    border-radius: 24px;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.secundary};
`;
export const Title = styled.Text`
    text-align: left;
    color: ${(props) => props.theme.colors.text};
    font-family: ${(props) => props.theme.text.bold};
    font-size: 28px;
    margin-left: 30px;
`;

export const FormTitle = styled.Text``;
export const Form = styled(Unform)`
    width: 100%;
`;

export const PickerContainer = styled.View`
    border-width: 2px;
    border-color: #000;
    display: flex;
    width: 100%;
`;
