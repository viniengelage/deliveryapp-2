import React, { useEffect } from 'react';
import Spinner from 'react-native-spinkit';

import { useTheme } from 'styled-components';

import { Container } from './styles';

const Loading = () => {
    const { colors } = useTheme();
    useEffect(() => {}, []);
    return (
        <Container>
            <Spinner
                isVisible
                size={100}
                color={colors.primary}
                type="ThreeBounce"
            />
        </Container>
    );
};

export default Loading;
