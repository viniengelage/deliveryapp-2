import React from 'react';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-spinkit';
import { useTheme } from 'styled-components';

import { Container, ButtonText } from './styles';

const styles = StyleSheet.create({
    spinner: {
        position: 'absolute',
        zIndex: 1,
    },
});

const Button = ({
    children,
    withoutBackground,
    notification,
    loading,
    ...rest
}) => {
    const { colors, shadow } = useTheme();
    return (
        <Container
            withoutBackground={withoutBackground}
            notification={notification}
            style={!withoutBackground && shadow}
            {...rest}
        >
            {loading ? (
                <Spinner
                    isVisible
                    size={32}
                    color={colors.secundary}
                    style={styles.spinner}
                    type="ThreeBounce"
                />
            ) : (
                <ButtonText
                    withoutBackground={withoutBackground}
                    notification={notification}
                >
                    {children}
                </ButtonText>
            )}
        </Container>
    );
};

export default Button;
