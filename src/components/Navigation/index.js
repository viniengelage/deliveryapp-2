import React, { useEffect } from 'react';
import { useOrder } from 'hooks/order';
import { useNotification } from 'hooks/notification';
import MapboxNavigation from './NavigationView';

const Navigation = ({ origin, destination }) => {
    const {
        registerLocation,
        orderStatus,
        currentOrder,
        deliveryId,
        onNavigation,
    } = useOrder();
    const { createNotification, removeNotification } = useNotification();

    useEffect(() => {
        console.log(origin, destination);
    }, []);

    return (
        <>
            {onNavigation && origin && destination && (
                <MapboxNavigation
                    origin={[
                        parseFloat(origin.longitude),
                        parseFloat(origin.latitude),
                    ]}
                    destination={[
                        parseFloat(destination.longitude),
                        parseFloat(destination.latitude),
                    ]}
                    shouldSimulateRoute
                    onProgressChange={(event) => {
                        const { latitude, longitude } = event.nativeEvent;
                        registerLocation(
                            latitude,
                            longitude,
                            orderStatus,
                            currentOrder,
                            deliveryId
                        );
                    }}
                    onError={() => {
                        createNotification({
                            type: 'push',
                            text: 'Algum erro aconteceu.',
                            buttonText: ['Recarregar página'],
                            buttonAction: [() => removeNotification()],
                        });
                    }}
                />
            )}
        </>
    );
};
export default Navigation;
