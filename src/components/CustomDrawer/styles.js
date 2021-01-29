import styled from 'styled-components/native';
import LogoImg from 'assets/logo.svg';
import { Switch as SwitchButton } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
`;

export const LogoContainer = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
`;

export const Switch = styled(SwitchButton)`
    margin-left: 10px;
`;

export const Logo = styled(LogoImg)`
    margin: 20px 0;
`;
export const ItemContainer = styled.View`
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: center;
`;
export const Item = styled.Text`
    font-size: 16px;
    margin-right: 10px;
`;

export const AvatarContainer = styled.View`
    align-items: center;
    width: 100%;
    height: 120px;
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.secundary};
    position: absolute;
    bottom: 0;
`;

export const AvatarName = styled.Text`
    font-size: 16px;
    font-weight: bold;
    font-family: ${(props) => props.theme.text.black};
    margin-left: 20px;
    color: ${(props) => props.theme.colors.button};
`;

export const Avatar = styled.Image`
    width: 64px;
    height: 64px;
    border-radius: 32px;
    align-items: center;
    margin-left: 20px;
`;

export const LogoutContainer = styled(RectButton)`
    position: absolute;
    bottom: 150px;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const LougoutText = styled.Text`
    font-size: 16px;
    font-family: ${(props) => props.theme.text.bold};
    color: ${(props) => props.theme.colors.secundary};
    margin-left: 10px;
`;
