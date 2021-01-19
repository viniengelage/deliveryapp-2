import React, { useEffect } from 'react';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';
import { useOrder } from 'hooks/order';
import { useNotification } from 'hooks/notification';

const Navigation = ({ origin, destination }) => {
    const { registerLocation } = useOrder();
    const { createNotification, removeNotification } = useNotification();

    return (
        <>
            <MapboxNavigation
                origin={[Number(origin.longitude), Number(origin.latitude)]}
                destination={[
                    Number(destination.longitude),
                    Number(destination.latitude),
                ]}
                shouldSimulateRoute
                onProgressChange={(event) => {
                    const { latitude, longitude } = event.nativeEvent;
                    registerLocation(latitude, longitude);
                }}
                onError={(event) => {
                    // const { message } = event.nativeEvent;
                    createNotification({
                        type: 'push',
                        text: 'Algum erro aconteceu.',
                        buttonText: ['Recarregar página'],
                        buttonAction: [() => removeNotification()],
                    });
                }}
                style={{ flex: 1, zIndex: 1 }}
            />
        </>
    );
};
export default Navigation;
