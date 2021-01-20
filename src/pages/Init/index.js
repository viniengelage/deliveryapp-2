import React from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from 'components/Button';
import { Container, Logo, Cycle, Title, Subtitle } from './styles';

const Init = () => {
    const navigation = useNavigation();

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
            />
            <Container>
                <Logo width={320} />
                <Cycle width={320} />
                <Title>Seja bem vindo</Title>
                <Subtitle withMargin>
                    Faça entregas para diversas partes da cidade.
                </Subtitle>
                <Button onPress={() => navigation.navigate('Login')}>
                    Faça login
                </Button>
                <Subtitle>ou</Subtitle>
                <Button
                    withoutBackground
                    onPress={() => navigation.navigate('Register')}
                >
                    Criar conta
                </Button>
            </Container>
        </>
    );
};

export default Init;
