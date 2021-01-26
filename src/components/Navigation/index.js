import React, { useEffect, useState } from 'react';
import { useOrder } from 'hooks/order';
import { useNotification } from 'hooks/notification';
import { useLocation } from 'hooks/location';
import MapboxNavigation from './NavigationView';

const Navigation = ({ destination }) => {
    const [origin, setOrigin] = useState();

    const {
        registerLocation,
        orderStatus,
        currentOrder,
        deliveryId,
        onNavigation,
    } = useOrder();

    const { getPosition } = useLocation();

    const { createNotification, removeNotification } = useNotification();

    useEffect(() => {
        getPosition().then((position) => {
            const { latitude, longitude } = position.coords;
            setOrigin({
                latitude,
                longitude,
            });
        });
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
