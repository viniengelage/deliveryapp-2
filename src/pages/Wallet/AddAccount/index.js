import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Yup from 'yup';

import Button from 'components/Button';
import Input from 'components/InputBasic';
import Picker from 'components/InputSelect';
import Color from 'components/InputColor';

import { auth } from 'services/api';
import getValidationErrors from 'utils/getValidationsErrors';
import { useAuth } from 'hooks/auth';
import { useNotification } from 'hooks/notification';
import {
    Container,
    GoBackContainer,
    Header,
    MenuContainer,
    Title,
    Form,
} from './styles';

const AddAccount = ({ addAccount }) => {
    const formRef = useRef(null);

    const bankAgencyRef = useRef(null);
    const bankAccountRef = useRef(null);
    const nameAccountRef = useRef(null);
    const cpfAccountRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const { id } = useAuth();
    const { createNotification, removeNotification } = useNotification();

    const handleSubmit = useCallback(async (data) => {
        setLoading(true);
        try {
            formRef.current.setErrors({});
            const schema = Yup.object().shape({
                bank: Yup.string().required('Este campo é necessário'),
                bank_account: Yup.number()
                    .required('Este campo é necessário')
                    .typeError('Digite apenas números'),
                bank_agency: Yup.number('Digite apenas números')
                    .required('Este campo é necessário')
                    .typeError('Digite apenas números'),
                name: Yup.string().required('Este campo é necessário'),
                cpf_cnpj: Yup.number('Digite apenas números')
                    .required('Este campo é necessário')
                    .typeError('Digite apenas números'),
                color: Yup.string().required('Escolha uma cor'),
                type: Yup.string()
                    .required('Este campo é necessário')
                    .oneOf(
                        ['Poupança', 'Corrente'],
                        'Escolha um tipo de conta'
                    ),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await auth.post(`users/${id}/accounts`, {
                data,
            });
            createNotification({
                type: 'push',
                withBackground: true,
                text: 'Parabéns, conta adicionda!',
                buttonText: ['Voltar'],
                buttonAction: [
                    () => {
                        removeNotification();
                        addAccount(false);
                    },
                ],
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current.setErrors(errors);
                setLoading(false);
            }
            if (error.response) {
                if (error.response.data.errors) {
                    if (error.response.data.errors) {
                        if (error.response.data.errors['data.cpf_cnpj']) {
                            formRef.current.setErrors({
                                cpf_cnpj: 'Digite um cpf válido',
                            });
                        }
                    }
                }
                if (error.response.data) {
                    console.log(error.response.data);
                }
            }
            setLoading(false);
        }
    }, []);

    const options = [
        { label: 'Escolha um tipo de conta', value: 'Choice' },
        { label: 'Poupança', value: 'Poupança' },
        { label: 'Corrente', value: 'Corrente' },
    ];

    return (
        <Container>
            <Header>
                <MenuContainer onPress={() => navigation.openDrawer()}>
                    <Icon name="bars" color={colors.background} size={28} />
                </MenuContainer>
                <Title>Adicionar conta</Title>
            </Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                enabled
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView>
                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <Input
                            name="bank"
                            placeholder="Banco"
                            type="text"
                            icon="university"
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="default"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                bankAgencyRef.current.focus();
                            }}
                        />
                        <Input
                            ref={bankAgencyRef}
                            name="bank_agency"
                            placeholder="Agencia"
                            type="text"
                            icon="file-invoice-dollar"
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                bankAccountRef.current.focus();
                            }}
                        />
                        <Input
                            ref={bankAccountRef}
                            name="bank_account"
                            placeholder="Conta"
                            type="text"
                            icon="coins"
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                nameAccountRef.current.focus();
                            }}
                        />
                        <Input
                            ref={nameAccountRef}
                            name="name"
                            placeholder="Nome da conta"
                            type="text"
                            icon="file-signature"
                            autoCorrect
                            autoCapitalize="none"
                            keyboardType="default"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                cpfAccountRef.current.focus();
                            }}
                        />
                        <Input
                            ref={cpfAccountRef}
                            name="cpf_cnpj"
                            placeholder="CPF"
                            type="numeric"
                            icon="id-card"
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                cpfAccountRef.current.focus();
                            }}
                        />
                        <Picker
                            name="type"
                            icon="key"
                            options={options}
                            placeholder="Teste"
                        />
                        <Color
                            name="color"
                            icon="palette"
                            placeholder="Cor para representar conta"
                        />
                        <Button
                            loading={loading}
                            onPress={() => formRef.current.submitForm()}
                        >
                            Cadastrar conta
                        </Button>
                    </Form>
                </ScrollView>
            </KeyboardAvoidingView>

            <GoBackContainer onPress={() => addAccount(false)}>
                <Icon name="chevron-left" color={colors.background} size={28} />
            </GoBackContainer>
        </Container>
    );
};
export default AddAccount;
