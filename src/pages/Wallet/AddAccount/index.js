import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from 'react-native-ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import Button from 'components/Button';
import Input from 'components/InputBasic';
import Picker from 'components/InputSelect';
import Color from 'components/InputColor';

import {
    Container,
    GoBackContainer,
    Header,
    MenuContainer,
    Title,
    Form,
    PickerContainer,
} from './styles';

const AddAccount = ({ addAccount }) => {
    const formRef = useRef(null);

    const bankAgencyRef = useRef(null);
    const bankAccountRef = useRef(null);
    const nameAccountRef = useRef(null);
    const cpfAccountRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const { colors } = useTheme();
    const navigation = useNavigation();

    useEffect(() => {
        console.log('Hello AddAccount');
    }, []);

    const handleSubmit = useCallback((data) => {
        console.log(data);
    }, []);

    // const data = {
    //     "bank":"jfgh",
    //     "bank_agency":1, //numérico
    //    "bank_account":1, //numérico
    //     "pix_qrcode":"", //pode ser nulo
    //     "name":"ghfgh",
    //     "cpf_cnpj":10014994178, //numérico
    //     "type":"Poupança", // ou "Corrente"
    //     "user_id":3
    // },

    const options = [
        { label: 'Escolha um tipo de conta', value: 'Choice' },
        { label: 'Poupança', value: 'Poupança' },
        { label: 'Corrente', value: 'Corrente' },
    ];

    return (
        <Container>
            <Header>
                <MenuContainer onPress={() => navigation.openDrawer()}>
                    <Icon name="menu" color={colors.background} />
                </MenuContainer>
                <Title>Adicionar conta</Title>
            </Header>

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
                    name="cpf_cpnj"
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

            <GoBackContainer onPress={() => addAccount(false)}>
                <Icon name="arrow-back" color={colors.background} />
            </GoBackContainer>
        </Container>
    );
};
export default AddAccount;
