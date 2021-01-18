import React, { useCallback, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth } from 'services/api';
import * as Yup from 'yup';

import getValidationErrors from 'utils/getValidationsErrors';

import InputBasic from 'components/InputBasic';

import Button from 'components/Button';

import { useNotification } from 'hooks/notification';
import { Container, Logo, Cycle, Form, ChoiceText } from './styles';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const navigation = useNavigation();
    const { createNotification, removeNotification } = useNotification();

    const handleSubmit = useCallback(async (data) => {
        setLoading(true);
        formRef.current.setErrors({});
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail é necessário.')
                    .email('Digite um e-mail válido.'),
                password: Yup.string().min(8, 'Minímo 8 caracteres.'),
                password_confirmation: Yup.string().oneOf(
                    [Yup.ref('password'), null],
                    'Senhas devem coincidir'
                ),
            });

            await schema.validate(data, { abortEarly: false });
            await auth.post('/auth/register', {
                ...data,
                role: 'driver',
            });
            setLoading(false);
            navigation.navigate('Login');
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current.setErrors(errors);
                setLoading(false);
                return;
            }

            if (error.response) {
                if (
                    error.response.data.message.includes(
                        'The given data was invalid'
                    )
                ) {
                    createNotification({
                        withBackground: true,
                        type: 'push',
                        text: 'Esse e-mail já foi usado por outra pessoa',
                        buttonText: ['Tentar de novo'],
                        buttonAction: [() => removeNotification()],
                    });
                    setLoading(false);
                    return;
                }
            }

            setLoading(false);
            createNotification({
                withBackground: true,
                type: 'push',
                text: 'Algum erro aconteceu, tente novamente mais tarde',
                buttonText: ['Concluido'],
                buttonAction: [() => removeNotification()],
            });
            console.log(error);
        }
    }, []);

    return (
        <Container>
            <Logo width={320} />
            <Cycle width={320} />
            <Form onSubmit={handleSubmit} ref={formRef}>
                <InputBasic
                    name="email"
                    icon="mail"
                    placeholder="E-mail"
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        passwordRef.current.focus();
                    }}
                />
                <InputBasic
                    ref={passwordRef}
                    name="password"
                    icon="lock"
                    placeholder="Senha"
                    secureTextEntry
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        confirmPasswordRef.current.focus();
                    }}
                />
                <InputBasic
                    ref={confirmPasswordRef}
                    name="password_confirmation"
                    icon="lock"
                    placeholder="Confirme sua senha"
                    secureTextEntry
                    returnKeyType="send"
                    onSubmitEditing={() => {
                        formRef.current.submitForm();
                    }}
                />
                <Button
                    loading={loading}
                    onPress={() => {
                        formRef.current.submitForm();
                    }}
                >
                    Criar conta
                </Button>
            </Form>
            <ChoiceText>ou</ChoiceText>
            <Button
                withoutBackground
                onPress={() => navigation.navigate('Login')}
            >
                Fazer login
            </Button>
        </Container>
    );
};

export default Register;
