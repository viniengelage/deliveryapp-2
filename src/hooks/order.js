import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';

import Geolocation from 'react-native-geolocation-service';
// import useInterval from 'use-interval';
import { PermissionsAndroid } from 'react-native';
import { getCenter, getDistance } from 'geolib';
import { orders, services } from 'services/api';
import AsyncStorage from '@react-native-community/async-storage';
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
    const [onLocal, setOnLocal] = useState(false);

    const [locationOrders, setLocationOrders] = useState([]);
    const [locationOrder, setLocationOrder] = useState({});
    const [hasManyOrders, setHasManyOrders] = useState(false);

    const [orderState, setOrderState] = useState({});
    const [orderId, setOrderId] = useState(0);

    const [orderLength, setOrderLength] = useState(0);
    const [currentOrder, setCurrentOrder] = useState({});
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

    // useInterval(
    //     async () => {
    //         const {
    //             coords: { latitude, longitude },
    //         } = await getPosition();
    //         socket.emit('registerLocation', {
    //             order_id: orderState.id,
    //             latitude,
    //             longitude,
    //         });
    //     },
    //     onRunning ? 5000 : null,
    //     true
    // );
    const requestGpsPermission = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permita que possamos usar a localização',
                    buttonNegative: 'Não',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                removeNotification();
            } else {
                createNotification({
                    withBackground: true,
                    type: 'push',
                    text:
                        'Sem sua localização, não podemos te mostrar o melhor',
                    buttonText: ['Denovo!'],
                    buttonAction: [() => requestGpsPermission()],
                });
            }
        } catch (error) {
            createNotification({
                withBackground: true,
                type: 'push',
                text:
                    'Aconteceu um erro e não podemos continuar, tente novamente mais tarde.',
                buttonText: ['Concluido'],
                buttonAction: [() => removeNotification()],
            });
        }
    }, []);

    const checkPermission = useCallback(async () => {
        const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (!granted) {
            createNotification({
                withBackground: true,
                type: 'push',
                text: 'Precisamos de sua permissão para acessar a localização',
                buttonText: ['Tudo bem!'],
                buttonAction: [() => requestGpsPermission()],
            });
        } else {
            getPosition().then((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({
                    latitude,
                    longitude,
                });
            });
        }
    }, []);

    const getStorageData = useCallback(async () => {
        const orderStatusStorage = await AsyncStorage.getItem('order_status');

        const orderStorage = JSON.parse(await AsyncStorage.getItem('order'));

        setOrderLength(orderStorage.orders.length);
        setOrderState(orderStorage);

        if (orderStorage.orders.length > 1) {
            const customerAddresses = [];
            orderStorage.orders.map((singleOrder) =>
                customerAddresses.push({
                    id: singleOrder.id,
                    latitude: Number(singleOrder.customer_address.latitude),
                    longitude: Number(singleOrder.customer_address.longitude),
                })
            );
            setHasManyOrders(true);
            setLocationOrders(customerAddresses);
            setCenterCoordinate(getCenter(customerAddresses));
        }

        setOrderState(orderStorage);

        if (orderStatusStorage === 'accepted') {
            if (orderStorage) {
                acceptOrder(orderStorage.orders[0]);
            }
        }
        if (orderStatusStorage === 'onNextOrder') {
            const orderCurrentStorage = JSON.parse(
                await AsyncStorage.getItem('current_order')
            );
            if (orderCurrentStorage) {
                acceptOrder(orderCurrentStorage);
            } else {
                createNotification({
                    type: 'push',
                    withBackground: true,
                    text: 'Algo deu errado. Recarregue a página.',
                    buttonText: ['Recarregar'],
                    buttonAction: [() => console.log('recarregar')],
                });
            }
        }
    }, []);

    useEffect(() => {
        // getStorageData();
        checkPermission();
    }, []);

    const newOrder = useCallback(async (order) => {
        setOrderLength(order.orders.length);
        setOrderState(order);

        if (order.orders.length > 1) {
            const customerAddresses = [];
            order.orders.map((singleOrder) =>
                customerAddresses.push({
                    id: singleOrder.id,
                    latitude: Number(singleOrder.customer_address.latitude),
                    longitude: Number(singleOrder.customer_address.longitude),
                })
            );
            setHasManyOrders(true);
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

        createNotification({
            type: 'running',
            text: 'Você recebeu um pedido de entrega',
            buttonText: ['Aceitar', 'Recusar'],
            buttonAction: [
                () => acceptOrder(order.orders[currentOrderIndex], order.id),
                () => declineOrder(order.orders[currentOrderIndex], order.id),
            ],
        });
        await AsyncStorage.setItem(
            'order_length',
            JSON.stringify(order.orders.length)
        );
        await AsyncStorage.setItem(
            'current_order',
            JSON.stringify(order.orders[currentOrderIndex])
        );
        await AsyncStorage.setItem('order', JSON.stringify(order));
    }, []);

    const acceptOrder = useCallback(async (order, orderID) => {
        setOrderId(orderID);
        removeNotification();
        setCurrentOrder(order);
        await services.put(`deliveries/${orderID}/accept`);
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

    const declineOrder = useCallback(async (order, orderID) => {
        await services.put(`deliveries/${orderID}/decline`);
        removeNotification();
        setZoom(18);
        setCenterCoordinate({
            latitude: Number(userLocation.latitude),
            longitude: Number(userLocation.longitude),
        });
        setLocationOrder([]);
    }, []);

    const initOrder = useCallback(() => {
        setOrderStatus(status.onReceiving);
        setOnRunning(true);
        setInitOrderStatus(true);
        removeNotification();
    }, []);

    const receivedOrder = useCallback(async (orderCurrent, orderID) => {
        setOrderStatus(status.onDelivery);
        removeNotification();

        setLoading(true);
        setInitOrderStatus(false);

        await services.put(`deliveries/${orderID}/start`);

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

            setInitOrderStatus(false);

            if (
                currentOrderIndexParam !== orderLengthParam - 1 &&
                hasManyOrdersParam
            ) {
                const address =
                    order.orders[currentOrderIndexParam + 1].customer_address;
                console.log(address);
                await orders.put(
                    `orders/${order.orders[currentOrderIndex].id}/finalize`
                );
                createNotification({
                    type: 'extract',
                    text: 'Estes são os detalhes da sua próxima entrega:',
                    description: `${address.street}, ${address.number} - ${address.district}`,
                    buttonText: ['Vamos lá'],
                    buttonAction: [() => nextOrder(order)],
                });
            } else {
                finishOrder(order, orderIdParam);
            }
        },
        []
    );

    const nextOrder = useCallback(async (order) => {
        removeNotification();
        setOnLocal(false);
        setOrderStatus(status.onDelivery);
        setDestination({
            latitude:
                order.orders[currentOrderIndex + 1].customer_address.latitude,
            longitude:
                order.orders[currentOrderIndex + 1].customer_address.longitude,
        });
        setCurrentOrder(order.orders[currentOrderIndex + 1]);
        setCurrentOrderIndex(currentOrderIndex + 1);
        setInitOrderStatus(true);
        await AsyncStorage.setItem('order_status', 'onNextOrder');
        await AsyncStorage.setItem(
            'current_order',
            JSON.stringify(order.orders[currentOrderIndex + 1])
        );
    }, []);

    const finishOrder = useCallback(async (order, orderIdParam) => {
        await services.put(`deliveries/${orderIdParam}/finalize`);
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
            orderID
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
                            () => receivedOrder(currentOrderParam, orderID),
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
                if (distance < 100) {
                    if (!onLocal) {
                        createNotification({
                            type: 'running',
                            text:
                                'Você está perto. Quando chegar, abra os detalhes do pedido e finalize a entrega',
                            buttonText: ['Entendido'],
                            buttonAction: [() => removeNotification()],
                        });
                    }
                    setOnLocal(true);
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
                orderState,
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
