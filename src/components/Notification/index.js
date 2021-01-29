import React, { useCallback, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import * as Yup from 'yup';

import ButtonForm from 'components/Button';
import Currency from 'components/InputCurrency';

import { useNotification } from 'hooks/notification';
import getValidationErrors from 'utils/getValidationsErrors';

import { transactions } from 'services/api';
import {
    Container,
    NotificationSvg,
    DetailSvg,
    Title,
    ButtonContainer,
    Button,
    Bar,
    Description,
    CurrencyContainer,
} from './styles';

const Notification = ({
    type,
    text,
    description,
    buttonText,
    buttonAction,
}) => {
    const runningProps = useSpring({ opacity: type ? 1 : 0 });
    const pushProps = useSpring({ opacity: type ? 1 : 0 });
    const AnimatedContainer = animated(Container);

    // {
    //     "type": "int",
    //     "ammount": "1000.00",
    //     "wallet_token": "wlt-16ca5de8-da04-4a22-a6e8-ca1ab0553129",
    //     "trm_token": "trm-64a3123f-f8ec-4508-83ec-bde672435da9"
    // }

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
        </>
    );
};

export default Notification;
