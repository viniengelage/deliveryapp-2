import React, { useCallback, useEffect, useRef } from 'react';

import Button from 'components/Button';
import Currency from 'components/InputCurrency';

import { useTheme } from 'styled-components';
import { Container, ContentContainer, Title, Form } from './styles';

const WithDraw = () => {
    const formRef = useRef(null);
    const { shadow } = useTheme();

    const handleSubmit = useCallback((data) => {
        console.log(data);
    }, []);

    return (
        <Container>
            <ContentContainer style={shadow}>
                <Title>Escolha o valor que deseja receber</Title>
                <Form onSubmit={handleSubmit} ref={formRef}>
                    <Currency
                        name="amount"
                        icon="money-check-alt"
                        placeholder="Digite o valor"
                    />
                    <Button onPress={() => console.log('hey')}>Enviar</Button>
                </Form>
            </ContentContainer>
        </Container>
    );
};
export default WithDraw;
