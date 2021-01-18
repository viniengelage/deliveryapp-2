import React, { Fragment } from 'react';
import { animated, useSpring } from 'react-spring';

import {
    Container,
    NotificationSvg,
    Title,
    ButtonContainer,
    Button,
    Bar,
    RunningSvg,
    Background,
} from './styles';

const Notification = ({
    type,
    text,
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
                            {buttonText.map((button, index) => (
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
                        {buttonText.map((button, index) => (
                            <Button
                                notification
                                onPress={buttonAction[index]}
                                key={buttonText[index]}
                            >
                                {buttonText[index]}
                            </Button>
                        ))}
                    </ButtonContainer>
                    <RunningSvg />
                </AnimatedContainer>
            )}
        </>
    );
};

export default Notification;
