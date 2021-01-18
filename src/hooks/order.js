import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';
import { services } from 'services/api';
import Navigation from 'components/Navigation';
import Geolocation from 'react-native-geolocation-service';
import { useNotification } from './notification';

const OrderContext = createContext({});

const OrderProvider = ({ children }) => {
    const { createNotification, removeNotification } = useNotification();
    const [sellerLocation, setSellerLocation] = useState({});
    const [userLocation, setUserLocation] = useState({});
    const [locationOrders, setLocationOrders] = useState([]);

    const getPosition = useCallback(
        (options) =>
            new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(resolve, reject, options);
            }),
        []
    );

    useEffect(() => {
        getPosition().then((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({
                latitude,
                longitude,
            });
        });
    }, []);

    const newOrder = useCallback((order) => {
        if (order.orders.length > 1) {
            console.log(order.orders);
            const customerAddresses = [];
            order.orders.map((singleOrder) =>
                customerAddresses.push({
                    latitude: singleOrder.customer_address.latitude,
                    longitude: singleOrder.customer_address.longitude,
                })
            );
            console.log(customerAddresses);
        }
    }, []);
    const showOrder = useCallback(async (order) => {}, []);
    const acceptOrder = useCallback(async (order) => {
        removeNotification();
        await services.put(`deliveries/${order.id}/accept`);
        createNotification({
            type: 'running',
            text: 'Podemos começar?',
            buttonText: ['Inicir'],
            buttonAction: [() => initOrder(order)],
        });
        setSellerLocation({
            latitude: order.seller.address.latitude,
            longitude: order.seller.address.longitude,
        });
    }, []);
    const declineOrder = useCallback(async (order) => {
        await services.put(`deliveries/${order.id}/decline`);
        removeNotification();
    }, []);
    const initOrder = useCallback(
        async () => (
            <Navigation destination={sellerLocation} origin={userLocation} />
        ),
        []
    );

    return (
        <OrderContext.Provider
            value={{
                newOrder,
                acceptOrder,
                initOrder,
                declineOrder,
                showOrder,
                locationOrders,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

function useOrder() {
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error('useOrder must be used within a OrderProvider');
    }

    return context;
}

export { OrderProvider, useOrder };
