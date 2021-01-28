import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-snap-carousel';

import { useNotification } from 'hooks/notification';

import Button from 'components/Button';
import Currency from 'components/InputCurrency';
import Picker from 'components/InputSelect';

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
    const navigation = useNavigation();

    const handleOptions = useCallback(() => {
        const options = [];

        wallets.map(({ data: wallet, id }) =>
            options.push({
                value: id,
                label: wallet.name,
            })
        );

        console.log(options);

        return options;
    }, []);

    const handleSubmit = useCallback(async (data) => {
        console.log(data);
        // setLoading(true);
        // try {
        //     const schema = Yup.object().shape({
        //         amount: Yup.number('Digite apenas números')
        //             .required('Este campo é necessário')
        //             .typeError('Digite apenas números'),
        //         wallet_token: Yup.string().required(),
        //         type: Yup.string().required(),
        //         trm_token: Yup.string().required(),
        //     });

        //     const transaction = {
        //         ...data,
        //         wallet_token: token,
        //         type: 'out',
        //         trm_token: 'trm-64a3123f-f8ec-4508-83ec-bde672435da9',
        //     };
        //     console.log(transaction);

        //     await schema.validate(transaction, {
        //         abortEarly: false,
        //     });

        //     console.log('passou pelo schema');

        //     await transactions.post('/wallets/transactions', transaction);

        //     setLoading(false);
        // } catch (error) {
        //     console.log(error);
        //     if (error instanceof Yup.ValidationError) {
        //         const errors = getValidationErrors(error);
        //         formRef.current.setErrors(errors);
        //         setLoading(false);
        //         return;
        //     }
        //     setLoading(false);
        // }
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
                            name="amount"
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
                            onPress={() => formRef.current.submitForm()}
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
