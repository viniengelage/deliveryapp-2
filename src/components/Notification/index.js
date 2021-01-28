import React, { Fragment, useCallback, useRef } from 'react';
import { animated, useSpring } from 'react-spring';

import ButtonForm from 'components/Button';
import Currency from 'components/InputCurrency';

import {
    Container,
    NotificationSvg,
    DetailSvg,
    Title,
    ButtonContainer,
    Button,
    Bar,
    Background,
    Description,
    Form,
    CurrencyContainer,
} from './styles';

const Notification = ({
    type,
    text,
    description,
    buttonText,
    buttonAction,
}) => {
    const formRef = useRef(null);

    const runningProps = useSpring({ opacity: type ? 1 : 0 });
    const pushProps = useSpring({ opacity: type ? 1 : 0 });
    const AnimatedContainer = animated(Container);

    const handleSubmit = useCallback((data) => {
        console.log(data);
    }, []);

    return (
        <>
            {type === 'push' && (
                <CurrencyContainer>
                    <AnimatedContainer style={pushProps}>
                        <Title push>{text}</Title>
                        <ButtonContainer push>
                            {buttonText &&
                                buttonText.map((button, index) => (
                                    <Button
                                        push
                                        notification
                                        onPress={buttonAction[index]}
                                        key={buttonText[index]}
                                    >
                                        {buttonText[index]}
                                    </Button>
                                ))}
                        </ButtonContainer>
                        <NotificationSvg />
                    </AnimatedContainer>
                </CurrencyContainer>
            )}

            {type === 'running' && (
                <AnimatedContainer running style={runningProps}>
                    <Bar />
                    <Title running>{text}</Title>
                    <ButtonContainer>
                        {buttonText &&
                            buttonText.map((button, index) => (
                                <Button
                                    notification
                                    onPress={buttonAction[index]}
                                    key={buttonText[index]}
                                >
                                    {buttonText[index]}
                                </Button>
                            ))}
                    </ButtonContainer>
                </AnimatedContainer>
            )}

            {type === 'extract' && (
                <AnimatedContainer push style={pushProps}>
                    <Bar />
                    <Title push>{text}</Title>
                    <Description>{description}</Description>
                    <ButtonContainer>
                        {buttonText &&
                            buttonText.map((button, index) => (
                                <Button
                                    notification
                                    onPress={buttonAction[index]}
                                    key={buttonText[index]}
                                >
                                    {buttonText[index]}
                                </Button>
                            ))}
                    </ButtonContainer>
                    <DetailSvg width={70} />
                </AnimatedContainer>
            )}

            {type === 'currency' && (
                <CurrencyContainer>
                    <AnimatedContainer currency style={runningProps}>
                        <Title currency>
                            Escolha o valor que deseja receber
                        </Title>
                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <Currency
                                name="amount"
                                icon="money-check-alt"
                                placeholder="Digite o valor"
                            />
                            <ButtonForm
                                onPress={() => formRef.current.submitForm()}
                            >
                                Enviar
                            </ButtonForm>
                        </Form>
                    </AnimatedContainer>
                </CurrencyContainer>
            )}
        </>
    );
};

export default Notification;
