import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';
import Navigation from 'components/Navigation';
import Geolocation from 'react-native-geolocation-service';
import { getCenter } from 'geolib';
import { services } from 'services/api';
import { useNotification } from './notification';

const OrderContext = createContext({});

const OrderProvider = ({ children }) => {
    const { createNotification, removeNotification } = useNotification();
    const [sellerLocation, setSellerLocation] = useState({});
    const [userLocation, setUserLocation] = useState({});
    const [locationOrders, setLocationOrders] = useState([]);
    const [locationOrder, setLocationOrder] = useState({});
    const [orderLength, setOrderLength] = useState(0);
    const [centerCoordinate, setCenterCoordinate] = useState([]);
    const [initOrderStatus, setInitOrderStatus] = useState(false);
    const [zoom, setZoom] = useState(18);

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

    const newOrder = useCallback(async (order) => {
        console.log(order.orders.length);
        console.log(order.orders[0]);
        if (order.orders.length > 1) {
            const customerAddresses = [];
            order.orders.map((singleOrder) =>
                customerAddresses.push({
                    id: singleOrder.id,
                    latitude: Number(singleOrder.customer_address.latitude),
                    longitude: Number(singleOrder.customer_address.longitude),
                })
            );
            setLocationOrders(customerAddresses);
            setCenterCoordinate(getCenter(customerAddresses));
        }
        const orderLocation = {
            latitude: Number(order.orders[0].customer_address.latitude),
            longitude: Number(order.orders[0].customer_address.longitude),
        };

        const {
            coords: { latitude, longitude },
        } = await getPosition();

        setCenterCoordinate(
            getCenter([{ latitude, longitude }, orderLocation])
        );
        setLocationOrder(orderLocation);
        setOrderLength(order.orders.length);
        setZoom(12);
        createNotification({
            type: 'running',
            text: 'Você recebeu um pedido de entrega',
            buttonText: ['Aceitar', 'Recusar'],
            buttonAction: [() => acceptOrder(order), () => declineOrder(order)],
        });
    }, []);
    const showOrder = useCallback(async (order) => {}, []);
    const acceptOrder = useCallback(async (order) => {
        removeNotification();
        // await services.put(`deliveries/${order.id}/accept`);
        setSellerLocation({
            latitude: order.orders[0].seller.address.latitude,
            longitude: order.orders[0].seller.address.longitude,
        });
        createNotification({
            type: 'running',
            text: 'Podemos começar?',
            buttonText: ['Iniciar'],
            buttonAction: [() => initOrder(order)],
        });
    }, []);

    const declineOrder = useCallback(async (order) => {
        // await services.put(`deliveries/${order.id}/decline`);
        removeNotification();
    }, []);
    const initOrder = useCallback(() => {
        removeNotification();
        setInitOrderStatus(true);
    }, []);

    const nextOrder = useCallback(async (order) => {
        console.log(order);
    }, []);

    return (
        <OrderContext.Provider
            value={{
                newOrder,
                acceptOrder,
                initOrder,
                declineOrder,
                showOrder,
                nextOrder,
                userLocation,
                sellerLocation,
                initOrderStatus,
                locationOrders,
                locationOrder,
                orderLength,
                centerCoordinate,
                zoom,
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
