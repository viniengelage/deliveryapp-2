import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-snap-carousel';
import * as Yup from 'yup';

import { useNotification } from 'hooks/notification';
import getValidationErrors from 'utils/getValidationsErrors';

import Button from 'components/Button';
import Currency from 'components/InputCurrency';
import Picker from 'components/InputSelect';

import { transactions } from 'services/api';
import {
    Container,
    Header,
    MenuContainer,
    Title,
    WalletContainer,
    Coin,
    WalletValue,
    AddContainer,
    BankCard,
    Name,
    AccountContainer,
    CarouselContainer,
    NextContainer,
    Form,
    FormContainer,
    CarouselAlign,
    FormTitle,
} from './styles';

const ListAccounts = ({ wallets, balance, addAccount, token }) => {
    const carouselRef = useRef(null);
    const formRef = useRef(null);

    const [loading, setLoading] = useState(0);

    const { colors, shadow } = useTheme();
    const { createNotification, removeNotification } = useNotification();
    const navigation = useNavigation();

    const handleOptions = useCallback(() => {
        const options = [];

        wallets.map(({ data: wallet, id }) =>
            options.push({
                value: id,
                label: wallet.name,
            })
        );

        return options;
    }, []);

    const handleSubmit = useCallback(async (data, { reset }) => {
        console.log(data);
        setLoading(true);
        try {
            const schema = Yup.object().shape({
                ammount: Yup.number('Digite apenas números')
                    .required('Este campo é necessário')
                    .typeError('Digite apenas números'),
                wallet_token: Yup.string().required(),
                type: Yup.string().required(),
                trm_token: Yup.string().required(),
                account_id: Yup.number()
                    .required()
                    .typeError('Escolha um banco'),
            });

            const transaction = {
                ...data,
                wallet_token: token,
                type: 'out',
                trm_token: 'trm-64a3123f-f8ec-4508-83ec-bde672435da9',
            };

            await schema.validate(transaction, {
                abortEarly: false,
            });

            await transactions.post('/wallets/transactions', transaction);

            reset();

            createNotification({
                type: 'push',
                text:
                    'Seu pedido foi enviado ao financeiro, em breve será processado',
                buttonText: ['Concluido'],
                buttonAction: [
                    () => {
                        removeNotification();
                        navigation.navigate('Home');
                    },
                ],
            });

            setLoading(false);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current.setErrors(errors);
                setLoading(false);
                return;
            }
            console.log(error);
            setLoading(false);
        }
    }, []);

    const renderAccounts = useCallback(
        ({ item: { data: wallet } }) => (
            <CarouselContainer key={wallet.id}>
                <BankCard
                    background={wallet.color}
                    onPress={() => console.log('pressed')}
                    style={shadow}
                >
                    <AccountContainer>
                        <Icon
                            name="university"
                            size={26}
                            color={colors.button}
                        />
                        <Name>{wallet.name}</Name>
                    </AccountContainer>
                    <Icon name="ellipsis-v" size={26} color={colors.button} />
                </BankCard>
                <NextContainer
                    onPress={() => carouselRef.current.snapToNext()}
                    style={shadow}
                >
                    <Icon
                        name="chevron-right"
                        size={26}
                        color={colors.button}
                    />
                </NextContainer>
            </CarouselContainer>
        ),
        []
    );

    return (
        <>
            <Container>
                <Header>
                    <MenuContainer onPress={() => navigation.openDrawer()}>
                        <Icon name="bars" color={colors.background} size={28} />
                    </MenuContainer>
                    <Title>Sua carteira</Title>
                </Header>
                <WalletContainer>
                    <Coin>R$</Coin>
                    <WalletValue>{balance && balance}</WalletValue>
                </WalletContainer>
                <CarouselAlign>
                    <Carousel
                        layout="default"
                        ref={carouselRef}
                        data={wallets}
                        sliderWidth={360}
                        itemWidth={360}
                        renderItem={renderAccounts}
                        loop
                    />
                </CarouselAlign>
                <FormContainer style={{ zIndex: -5 }}>
                    <FormTitle>Retirar dinheiro</FormTitle>
                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <Currency
                            name="ammount"
                            icon="money-check-alt"
                            placeholder="Digite o valor"
                        />
                        <Picker
                            name="account_id"
                            icon="university"
                            options={handleOptions()}
                            placeholder="Banco"
                        />
                        <Button
                            loading={loading}
                            onPress={() =>
                                formRef.current.clearField('ammount')
                            }
                        >
                            Solicitar
                        </Button>
                    </Form>
                </FormContainer>
                <AddContainer onPress={() => addAccount(true)}>
                    <Icon
                        name="chevron-right"
                        color={colors.background}
                        size={28}
                    />
                </AddContainer>
            </Container>
        </>
    );
};
export default ListAccounts;
