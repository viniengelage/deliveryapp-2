import React, { useEffect } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';
import { Container } from './styles';

const Navigation = ({ origin, destination }) => {
    useEffect(() => {
        console.log('Hello Navigation');
    }, []);

    return (
        <Container>
            {origin && destination && (
                <MapboxNavigation
                    origin={[origin.longitude, origin.latitude]}
                    destination={[destination.longitude, destination.latitude]}
                    shouldSimulateRoute
                    onProgressChange={(event) => {}}
                    onError={(event) => {
                        const { message } = event.nativeEvent;
                        console.log(message);
                    }}
                    style={{ flex: 1, zIndex: 2 }}
                />
            )}
        </Container>
    );
};
export default Navigation;
