import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';

// import useInterval from 'use-interval';
import { getCenter, getDistance } from 'geolib';
import { orders, services } from 'services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { useNotification } from './notification';
import { useLoading } from './loading';
import { useLocation } from './location';

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

    const { userLocation: initialLocation } = useLocation();

    const [userLocation, setUserLocation] = useState(initialLocation);
    const [destination, setDestination] = useState({});

    const [onRunning, setOnRunning] = useState(false);
    const [onLocal, setOnLocal] = useState(false);

    const [locationOrders, setLocationOrders] = useState([]);
    const [locationOrder, setLocationOrder] = useState({});
    const [hasManyOrders, setHasManyOrders] = useState(false);

    const [deliveryState, setDeliveryState] = useState({});
    const [orderId, setOrderId] = useState(0);

    const [orderLength, setOrderLength] = useState(0);
    const [currentOrder, setCurrentOrder] = useState({});
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
    const [centerCoordinate, setCenterCoordinate] = useState([]);

    const [initOrderStatus, setInitOrderStatus] = useState(false);
    const [orderStatus, setOrderStatus] = useState(status.notStarted);

    const [zoom, setZoom] = useState(18);

    const { getPosition } = useLocation();

    // useInterval(
    //     async () => {
    //         const {
    //             coords: { latitude, longitude },
    //         } = await getPosition();
    //         socket.emit('registerLocation', {
    //             order_id: deliveryState.id,
    //             latitude,
    //             longitude,
    //         });
    //     },
    //     onRunning ? 5000 : null,
    //     true
    // );

    const getStorageData = useCallback(async () => {
        const deliveryStatusStorage = await AsyncStorage.getItem(
            'order_status'
        );

        const deliveryStorage = JSON.parse(
            await AsyncStorage.getItem('delivery')
        );

        const orderCurrentStorage = JSON.parse(
            await AsyncStorage.getItem('current_order')
        );

        if (deliveryStorage) {
            setOrderLength(deliveryStorage.orders.length);
            setDeliveryState(deliveryStorage);
            setOrderId(deliveryStorage.id);

            if (deliveryStorage.orders.length > 1) {
                const customerAddresses = [];
                deliveryStorage.orders.map((singleOrder) =>
                    customerAddresses.push({
                        id: singleOrder.id,
                        latitude: singleOrder.customer_address.latitude,
                        longitude: singleOrder.customer_address.longitude,
                    })
                );
                setHasManyOrders(true);
                setLocationOrders(customerAddresses);
                setCenterCoordinate(getCenter(customerAddresses));
            }

            setDeliveryState(deliveryStorage);

            if (deliveryStatusStorage === 'accepted') {
                acceptOrder(deliveryStorage.orders[0]);
            }

            if (deliveryStatusStorage === 'started') {
                setDestination({
                    latitude: deliveryStatusStorage.orders[0].latitude,
                    longitude: deliveryStatusStorage.orders[0].longitude,
                });
            }

            if (deliveryStatusStorage === 'onRunning') {
                setDestination({
                    latitude: orderCurrentStorage.latitude,
                    longitude: orderCurrentStorage.longitude,
                });
            }
        }
    }, []);

    useEffect(() => {
        getStorageData();
    }, []);

    const newOrder = useCallback(async (delivery) => {
        setOrderLength(delivery.orders.length);
        setDeliveryState(delivery);

        const customerLocation = {
            latitude: delivery.orders[0].customer_address.latitude,
            longitude: delivery.orders[0].customer_address.longitude,
        };

        if (delivery.orders.length > 1) {
            const customerAddresses = [];
            delivery.orders.map((order) =>
                customerAddresses.push({
                    id: order.id,
                    latitude: parseFloat(order.customer_address.latitude),
                    longitude: parseFloat(order.customer_address.longitude),
                })
            );
            setHasManyOrders(true);
            setLocationOrders(customerAddresses);
        } else {
            setLocationOrder(customerLocation);
        }

        const {
            coords: { latitude, longitude },
        } = await getPosition();

        setZoom(12);
        setCenterCoordinate(
            getCenter([{ latitude, longitude }, customerLocation])
        );

        createNotification({
            type: 'running',
            text: 'Você recebeu um pedido de entrega',
            buttonText: ['Aceitar', 'Recusar'],
            buttonAction: [
                () =>
                    acceptOrder(
                        delivery.orders[currentOrderIndex],
                        delivery.id
                    ),
                () =>
                    declineOrder(
                        delivery.orders[currentOrderIndex],
                        delivery.id
                    ),
            ],
        });
        await AsyncStorage.setItem(
            'order_length',
            JSON.stringify(delivery.orders.length)
        );
        await AsyncStorage.setItem(
            'current_order',
            JSON.stringify(delivery.orders[currentOrderIndex])
        );
        await AsyncStorage.setItem('delivery', JSON.stringify(delivery));
    }, []);

    const acceptOrder = useCallback(async (order, deliveryId) => {
        setOrderId(deliveryId);
        removeNotification();
        setCurrentOrder(order);

        await services.put(`deliveries/${deliveryId}/accept`);

        setDestination({
            latitude: order.seller.address.latitude,
            longitude: order.seller.address.longitude,
        });
        createNotification({
            type: 'running',
            text: 'Podemos começar?',
            buttonText: ['Iniciar'],
            buttonAction: [() => initOrder(order)],
        });
        await AsyncStorage.setItem('order_status', 'accepted');
    }, []);

    const declineOrder = useCallback(async (order, deliveryId) => {
        await services.put(`deliveries/${deliveryId}/decline`);
        removeNotification();
        setZoom(18);
        setCenterCoordinate({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
        });
        setLocationOrder([]);
    }, []);

    const initOrder = useCallback(async () => {
        setOrderStatus(status.onReceiving);
        setOnRunning(true);
        setInitOrderStatus(true);
        await AsyncStorage.setItem('order_status', 'started');
        removeNotification();
    }, []);

    const receivedOrder = useCallback(async (orderCurrent, deliveryId) => {
        setOrderStatus(status.onDelivery);
        removeNotification();

        setLoading(true);
        setInitOrderStatus(false);

        await services.put(`deliveries/${deliveryId}/start`);
        await AsyncStorage.setItem('order_status', 'onRunning');

        const {
            coords: { latitude, longitude },
        } = await getPosition();

        setUserLocation({
            latitude,
            longitude,
        });

        setDestination({
            latitude: orderCurrent.customer_address.latitude,
            longitude: orderCurrent.customer_address.longitude,
        });
        setInitOrderStatus(true);
        setLoading(false);
    }, []);

    const deliveryOrder = useCallback(
        async (
            order,
            currentOrderIndexParam,
            orderLengthParam,
            hasManyOrdersParam,
            orderIdParam
        ) => {
            removeNotification();

            setLoading(true);

            await orders.put(
                `orders/${order.orders[currentOrderIndexParam].id}/finalize`
            );

            setInitOrderStatus(false);

            if (
                currentOrderIndexParam !== orderLengthParam - 1 &&
                hasManyOrdersParam
            ) {
                setLoading(false);
                const address =
                    order.orders[currentOrderIndexParam + 1].customer_address;
                createNotification({
                    type: 'extract',
                    text: 'Estes são os detalhes da sua próxima entrega:',
                    description: `${address.street}, ${address.number} - ${address.district}`,
                    buttonText: ['Vamos lá'],
                    buttonAction: [
                        () => nextOrder(order, currentOrderIndexParam),
                    ],
                });
            } else {
                finishOrder(order, orderIdParam);
            }
        },
        []
    );

    const nextOrder = useCallback(async (order, currentOrderIndexParam) => {
        removeNotification();
        setOnLocal(false);
        setOrderStatus(status.onDelivery);
        setDestination({
            latitude:
                order.orders[currentOrderIndexParam + 1].customer_address
                    .latitude,
            longitude:
                order.orders[currentOrderIndexParam + 1].customer_address
                    .longitude,
        });
        setCurrentOrder(order.orders[currentOrderIndexParam + 1]);
        setCurrentOrderIndex(currentOrderIndexParam + 1);
        setInitOrderStatus(true);
        await AsyncStorage.setItem(
            'current_order',
            JSON.stringify(order.orders[currentOrderIndexParam + 1])
        );
    }, []);

    const finishOrder = useCallback(async (order, deliveryId) => {
        await services.put(`deliveries/${deliveryId}/delivery`);
        await services.put(`deliveries/${deliveryId}/finalize`);

        setLoading(false);

        setInitOrderStatus(false);
        setOnRunning(false);

        setCurrentOrder({});
        setCurrentOrderIndex(0);
        setDestination({});
        setHasManyOrders(false);
        setLocationOrder({});
        setLocationOrders([]);

        await AsyncStorage.removeItem('order_status');
        await AsyncStorage.removeItem('order');
        await AsyncStorage.removeItem('current_order');

        setZoom(18);

        const {
            coords: { latitude, longitude },
        } = await getPosition();

        setUserLocation({
            latitude,
            longitude,
        });
        createNotification({
            type: 'push',
            text: 'Você finalizou a entrega, muito obrigado!',
            buttonText: ['Fechar'],
            buttonAction: [() => removeNotification()],
            withBackground: true,
        });
    }, []);

    const registerLocation = useCallback(
        async (
            latitude,
            longitude,
            statusOrder,
            currentOrderParam,
            deliveryId
        ) => {
            if (statusOrder === status.onReceiving) {
                const distance = getDistance(
                    { latitude, longitude },
                    {
                        latitude: currentOrderParam.seller.address.latitude,
                        longitude: currentOrderParam.seller.address.longitude,
                    }
                );
                if (distance < 100) {
                    createNotification({
                        type: 'running',
                        text: 'Você está perto.',
                        buttonText: ['Entrega recebida'],
                        buttonAction: [
                            () => receivedOrder(currentOrderParam, deliveryId),
                        ],
                    });
                }
            }
            if (statusOrder === status.onDelivery) {
                const distance = getDistance(
                    { latitude, longitude },
                    {
                        latitude: currentOrderParam.customer_address.latitude,
                        longitude: currentOrderParam.customer_address.longitude,
                    }
                );

                if (distance < 100 && !onLocal) {
                    createNotification({
                        type: 'running',
                        text:
                            'Você está perto. Quando chegar, abra os detalhes do pedido e finalize a entrega',
                        buttonText: ['Entendido'],
                        buttonAction: [
                            () => {
                                setOnLocal(true);
                                removeNotification();
                            },
                        ],
                    });
                }
            }
        },
        []
    );

    return (
        <OrderContext.Provider
            value={{
                newOrder,
                acceptOrder,
                initOrder,
                declineOrder,
                nextOrder,
                registerLocation,
                deliveryOrder,
                onLocal,
                orderId,
                deliveryState,
                orderStatus,
                currentOrder,
                onRunning,
                userLocation,
                destination,
                initOrderStatus,
                locationOrder,
                locationOrders,
                currentOrderIndex,
                orderLength,
                centerCoordinate,
                zoom,
                hasManyOrders,
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
