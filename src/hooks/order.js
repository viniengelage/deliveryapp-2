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
    const [deliveryId, setDeliveryId] = useState(0);

    const [orderLength, setOrderLength] = useState(0);
    const [currentOrder, setCurrentOrder] = useState({});
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
    const [centerCoordinate, setCenterCoordinate] = useState([]);

    const [onNavigation, setOnNavigation] = useState(false);
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
            'delivery_status'
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
            setDeliveryId(deliveryStorage.id);

            if (deliveryStorage.orders.length > 1) {
                setHasManyOrders(true);
            }

            setDeliveryState(deliveryStorage);

            if (deliveryStatusStorage === 'accepted') {
                acceptOrder(deliveryStorage.orders[0]);
            }

            if (deliveryStatusStorage === 'started') {
                setDeliveryId(deliveryStorage.id);
                setCurrentOrder(orderCurrentStorage);

                const sellerAddress = {
                    latitude: deliveryStorage.orders[0].seller.address.latitude,
                    longitude:
                        deliveryStorage.orders[0].seller.address.longitude,
                };

                initOrder(sellerAddress);
            }

            if (deliveryStatusStorage === 'onDelivery') {
                setOrderStatus(status.onDelivery);

                setDeliveryId(deliveryStorage.id);
                setCurrentOrder(orderCurrentStorage);

                setDestination({
                    latitude: orderCurrentStorage.customer_address.latitude,
                    longitude: orderCurrentStorage.customer_address.longitude,
                });

                // setOnRunning(true);
                // setOnNavigation(true);
            }
        }
    }, []);

    useEffect(() => {
        console.log('init');
    }, []);

    const newOrder = useCallback(async (delivery) => {
        setOrderLength(delivery.orders.length);
        setDeliveryState(delivery);

        const customerLocation = {
            latitude: delivery.orders[0].customer_address.latitude,
            longitude: delivery.orders[0].customer_address.longitude,
        };

        const {
            coords: { latitude, longitude },
        } = await getPosition();

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

            const center = [];

            customerAddresses.map((oneAddress) => center.push(oneAddress));
            center.push({ latitude, longitude });

            setZoom(12);
            setCenterCoordinate(getCenter(center));
        } else {
            setLocationOrder(customerLocation);

            setZoom(1);
            setCenterCoordinate(
                getCenter([{ latitude, longitude }, customerLocation])
            );
        }
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

    const acceptOrder = useCallback(async (delivery, deliveryIdParam) => {
        setLocationOrder([]);
        setLocationOrders([]);

        removeNotification();

        setDeliveryId(deliveryIdParam);
        setCurrentOrder(delivery);

        const sellerAddress = {
            latitude: delivery.seller.address.latitude,
            longitude: delivery.seller.address.longitude,
        };

        const {
            coords: { latitude, longitude },
        } = await getPosition();

        setCenterCoordinate({ latitude, longitude });
        setZoom(18);

        // await services.put(`deliveries/${deliveryIdParam}/accept`);
        await AsyncStorage.setItem('delivery_status', 'accepted');

        createNotification({
            type: 'running',
            text: 'Podemos começar?',
            buttonText: ['Iniciar'],
            buttonAction: [() => initOrder(delivery, sellerAddress)],
        });
    }, []);

    const declineOrder = useCallback(async (order, deliveryIdParam) => {
        // await services.put(`deliveries/${deliveryIdParam}/decline`);
        removeNotification();
        setZoom(18);
        setCenterCoordinate({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
        });
        setLocationOrder([]);
        setLocationOrders([]);
        await AsyncStorage.removeItem('order_length');
        await AsyncStorage.removeItem('current_order');
        await AsyncStorage.removeItem('delivery');
    }, []);

    const initOrder = useCallback(async (sellerAddress) => {
        setDestination(sellerAddress);
        await AsyncStorage.setItem('delivery_status', 'started');
        setOrderStatus(status.onReceiving);
        setOnRunning(true);
        setOnNavigation(true);
        removeNotification();
    }, []);

    const receivedOrder = useCallback(
        async (currentOrderParam, deliveryIdParam) => {
            setOrderStatus(status.onDelivery);
            removeNotification();

            setOnNavigation(false);
            setLoading(true);

            // await services.put(`deliveries/${deliveryIdParam}/start`);
            await AsyncStorage.setItem('delivery_status', 'onDelivery');

            const {
                coords: { latitude, longitude },
            } = await getPosition();

            setUserLocation({
                latitude,
                longitude,
            });

            setDestination({
                latitude: currentOrderParam.customer_address.latitude,
                longitude: currentOrderParam.customer_address.longitude,
            });

            setOnNavigation(true);
            setLoading(false);
        },
        []
    );

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

            // await orders.put(
            //     `orders/${order.orders[currentOrderIndexParam].id}/finalize`
            // );

            setOnNavigation(false);

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

        setOnNavigation(true);

        await AsyncStorage.setItem(
            'current_order',
            JSON.stringify(order.orders[currentOrderIndexParam + 1])
        );
    }, []);

    const finishOrder = useCallback(async (order, deliveryIdParam) => {
        // await services.put(`deliveries/${deliveryIdParam}/delivery`);
        // await services.put(`deliveries/${deliveryIdParam}/finalize`);

        setLoading(false);

        setOnNavigation(false);
        setOnRunning(false);

        setCurrentOrder({});
        setCurrentOrderIndex(0);
        setDestination({});
        setHasManyOrders(false);
        setLocationOrder({});
        setLocationOrders([]);

        await AsyncStorage.removeItem('delivery_status');
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
            deliveryIdParam
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
                            () =>
                                receivedOrder(
                                    currentOrderParam,
                                    deliveryIdParam
                                ),
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
                getStorageData,
                onLocal,
                deliveryId,
                deliveryState,
                orderStatus,
                currentOrder,
                userLocation,
                destination,
                locationOrder,
                locationOrders,
                currentOrderIndex,
                orderLength,
                centerCoordinate,
                zoom,
                hasManyOrders,
                onRunning,
                onNavigation,
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
