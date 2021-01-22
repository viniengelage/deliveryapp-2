import React from 'react';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';
import { useOrder } from 'hooks/order';
import { useNotification } from 'hooks/notification';

const Navigation = ({ origin, destination }) => {
    const { registerLocation, orderStatus, currentOrder, orderId } = useOrder();
    const { createNotification, removeNotification } = useNotification();

    return (
        <>
            {origin && destination && (
                <MapboxNavigation
                    origin={[
                        parseFloat(origin.longitude),
                        parseFloat(origin.latitude),
                    ]}
                    destination={[
                        parseFloat(destination.longitude),
                        parseFloat(destination.latitude),
                    ]}
                    shouldSimulateRoute={false}
                    onProgressChange={(event) => {
                        const { latitude, longitude } = event.nativeEvent;
                        registerLocation(
                            latitude,
                            longitude,
                            orderStatus,
                            currentOrder,
                            orderId
                        );
                    }}
                    onError={() => {
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
            )}
        </>
    );
};
export default Navigation;
