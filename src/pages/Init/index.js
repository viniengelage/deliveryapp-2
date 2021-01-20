import React, { useEffect, useCallback } from 'react';
import { PermissionsAndroid, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from 'components/Button';
import { useNotification } from 'hooks/notification';
import { Container, Logo, Cycle, Title, Subtitle } from './styles';

const Init = () => {
    const navigation = useNavigation();
    const { createNotification, removeNotification } = useNotification();

    const requestGpsPermission = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permita que possamos usar a localização',
                    buttonNegative: 'Não',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                removeNotification();
            } else {
                createNotification({
                    withBackground: true,
                    type: 'push',
                    text:
                        'Sem sua localização, não podemos te mostrar o melhor',
                    buttonText: ['Denovo!'],
                    buttonAction: [() => requestGpsPermission()],
                });
            }
        } catch (error) {
            createNotification({
                withBackground: true,
                type: 'push',
                text:
                    'Aconteceu um erro e não podemos continuar, tente novamente mais tarde.',
                buttonText: ['Concluido'],
                buttonAction: [() => removeNotification()],
            });
        }
    }, []);

    const checkPermission = useCallback(async () => {
        const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (!granted) {
            createNotification({
                withBackground: true,
                type: 'push',
                text: 'Precisamos de sua permissão para acessar a localização',
                buttonText: ['Tudo bem!'],
                buttonAction: [() => requestGpsPermission()],
            });
        }
    }, []);

    useEffect(() => {
        checkPermission();
    }, []);

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
