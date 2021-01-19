import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';
import Navigation from 'components/Navigation';
import Geolocation from 'react-native-geolocation-service';
import { getCenter, getDistance } from 'geolib';
import { services } from 'services/api';
import orderJSON from 'utils/order';
import { useNotification } from './notification';
import { useLoading } from './loading';

const OrderContext = createContext({});

const status = {
    notStarted: 'Não iniciada',
    onReceiving: 'Em direção ao restaurante',
    onDelivery: 'Em direção ao seller',
    received: 'Recebido',
};

const OrderProvider = ({ children }) => {
    const { createNotification, removeNotification } = useNotification();
    const { setLoading } = useLoading();

    const [userLocation, setUserLocation] = useState({});
    const [destination, setDestination] = useState({});
    const [onRunning, setOnRunning] = useState(false);

    const [locationOrders, setLocationOrders] = useState([]);
    const [locationOrder, setLocationOrder] = useState({});
    const [hasManyOrders, setHasManyOrders] = useState(false);

    const [orderLength, setOrderLength] = useState(0);
    const [currentOrder, setCurrentOrder] = useState(orderJSON.orders[0]);
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
    const [centerCoordinate, setCenterCoordinate] = useState([]);

    const [initOrderStatus, setInitOrderStatus] = useState(false);
    const [orderStatus, setOrderStatus] = useState(status.notStarted);

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
        setOrderLength(order.orders.length);

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

        if (order.orders.length > 1) {
            setHasManyOrders(true);
        }

        const customerLocation = {
            latitude: Number(order.orders[0].customer_address.latitude),
            longitude: Number(order.orders[0].customer_address.longitude),
        };

        const {
            coords: { latitude, longitude },
        } = await getPosition();

        setZoom(12);
        setCenterCoordinate(
            getCenter([{ latitude, longitude }, customerLocation])
        );

        setLocationOrder(customerLocation);
        setCurrentOrder(order.orders[currentOrderIndex]);

        createNotification({
            type: 'running',
            text: 'Você recebeu um pedido de entrega',
            buttonText: ['Aceitar', 'Recusar'],
            buttonAction: [() => acceptOrder(order), () => declineOrder(order)],
        });
    }, []);

    const acceptOrder = useCallback(async (order) => {
        removeNotification();
        // await services.put(`deliveries/${order.id}/accept`);
        setDestination({
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
        setOnRunning(true);
        setOrderStatus(status.onReceiving);
        removeNotification();
        setInitOrderStatus(true);
    }, []);

    const receivedOrder = useCallback(async () => {
        setLoading(true);
        setInitOrderStatus(false);

        // await services.put(`deliveries/${order.id}/start`);

        const {
            coords: { latitude, longitude },
        } = await getPosition();

        setUserLocation({
            latitude,
            longitude,
        });

        setDestination({
            latitude: currentOrder.latitude,
            longitude: currentOrder.longitude,
        });
        setInitOrderStatus(true);
        setLoading(false);
    }, []);

    const nextOrder = useCallback(async (order) => {
        setInitOrderStatus(false);
        setLoading(true);
        if (currentOrderIndex === orderLength) {
            finishOrder();
        } else if (hasManyOrders) {
            setCurrentOrder(currentOrderIndex + 1);
            setDestination(order.orders[currentOrderIndex + 1]);
        }
    }, []);

    const registerLocation = useCallback(async (latitude, longitude, order) => {
        console.log(latitude, longitude);

        if (status.onReceiving) {
            const distance = getDistance(
                { latitude, longitude },
                {
                    latitude: currentOrder.customer_address.latitude,
                    longitude: currentOrder.customer_address.longitude,
                }
            );
            if (distance < 100) {
                createNotification({
                    type: 'running',
                    text: 'Você está perto.',
                    buttonText: ['Entrega recebida'],
                    buttonAction: [() => receivedOrder(order)],
                });
            }
        }
    }, []);

    return (
        <OrderContext.Provider
            value={{
                newOrder,
                acceptOrder,
                initOrder,
                declineOrder,
                nextOrder,
                registerLocation,
                onRunning,
                userLocation,
                destination,
                initOrderStatus,
                locationOrder,
                locationOrders,
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
