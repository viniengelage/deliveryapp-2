import React, { useEffect } from 'react';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';
import { Container } from './styles';

const Navigation = ({ origin, destination }) => {
    useEffect(() => {
        console.log(origin, destination);
    }, []);
    const teste = {
        longitude: '-54.5841703',
        latitude: '-25.5441434',
    };
    const teste2 = {
        longitude: '-54.5819816',
        latitude: '-25.5441434',
    };

    return (
        <MapboxNavigation
            origin={[Number(teste.longitude), Number(teste.latitude)]}
            destination={[Number(teste2.longitude), Number(teste2.latitude)]}
            shouldSimulateRoute
            onProgressChange={(event) => {
                console.log(event);
            }}
            onError={(event) => {
                const { message } = event.nativeEvent;
                console.log(message);
            }}
            style={{ flex: 1, zIndex: 1 }}
        />
    );
};
export default Navigation;
