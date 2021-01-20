import React, { Fragment } from 'react';
import { animated, useSpring } from 'react-spring';

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
} from './styles';

const Notification = ({
    type,
    text,
    description,
    buttonText,
    buttonAction,
    withBackground,
}) => {
    const runningProps = useSpring({ opacity: type ? 1 : 0 });
    const pushProps = useSpring({ opacity: type ? 1 : 0 });
    const AnimatedContainer = animated(Container);

    const BooleanBackground = withBackground ? Background : Fragment;

    return (
        <>
            {type === 'push' && (
                <BooleanBackground>
                    <AnimatedContainer push style={pushProps}>
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
                </BooleanBackground>
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
                <AnimatedContainer extract style={runningProps}>
                    <Bar />
                    <Title extract>{text}</Title>
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
