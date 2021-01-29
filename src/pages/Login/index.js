import React, { useRef, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import getValidationErrors from 'utils/getValidationsErrors';

import { KeyboardAvoidingView } from 'react-native';

import InputBasic from 'components/InputBasic';

import Button from 'components/Button';
import { useAuth } from 'hooks/auth';
import { useNotification } from 'hooks/notification';
import { Container, Logo, Cycle, Form, ChoiceText } from './styles';

const Login = () => {
    const [loading, setLoading] = useState();
    const passwordRef = useRef(null);
    const formRef = useRef(null);
    const navigation = useNavigation();

    const { signIn } = useAuth();
    const { createNotification, removeNotification } = useNotification();

    const handleSubmit = useCallback(async (data) => {
        setLoading(true);
        try {
            formRef.current.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string()
                    .email('Digite um e-mail válido')
                    .required('Email necessário'),
                password: Yup.string().required('Senha obrigatória'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await signIn({
                email: data.email,
                password: data.password,
            });
            setLoading(false);
            navigation.navigate('Home');
        } catch (error) {
            console.log(error);
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current.setErrors(errors);
                setLoading(false);
                return;
            }
            if (
                error.response.data.message.includes(
                    'The given data was invalid'
                )
            ) {
                createNotification({
                    withBackground: true,
                    type: 'push',
                    text:
                        'Essas credenciais não correspondem aos nossos registros.',
                    buttonText: ['Tentar de novo'],
                    buttonAction: [() => removeNotification()],
                });
                setLoading(false);
            }
            setLoading(false);
        }
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Container>
                <Logo width={320} />
                <Cycle width={320} />
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <InputBasic
                        name="email"
                        icon="user"
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
                        icon="user-lock"
                        placeholder="Senha"
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
                        Fazer login
                    </Button>
                    <ChoiceText>ou</ChoiceText>
                    <Button
                        withoutBackground
                        onPress={() => navigation.navigate('Register')}
                    >
                        Criar conta
                    </Button>
                </Form>
            </Container>
        </KeyboardAvoidingView>
    );
};

export default Login;
