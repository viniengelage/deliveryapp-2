import AsyncStorage from '@react-native-community/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

import useSocketIo from 'use-socket.io-client';
import { useOrder } from './order';

const Socket = createContext({});

const SocketProvider = ({ token, children }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const { newOrder } = useOrder();

    const Ip = 'ws://agt-dvr-delivery.herokuapp.com/dvr';
    const [socket] = useSocketIo(Ip, {
        autoConnect: false,
        transports: ['polling', 'websocket'],
        transportOptions: {
            polling: {
                extraHeaders: {
                    authorization: `${token}`,
                },
            },
        },
    });

    const toggleSwitch = async () => {
        if (!isEnabled) {
            socket.connect();
            socket.on('connect', () => {
                setIsEnabled(true);
                console.log(socket.connected);
            });
            await AsyncStorage.setItem('statusSocket', 'connected');
        } else {
            socket.disconnect();
            await AsyncStorage.setItem('statusSocket', 'disconnect');
            setIsEnabled(false);
        }
    };

    const getConnectionStatus = async () => {
        const status = await AsyncStorage.getItem('statusSocket');

        if (status === 'connected' && !socket.connected) {
            socket.on('connected', () => {
                setIsEnabled(true);
            });
        }

        if (socket.connected) return setIsEnabled(true);
    };

    useEffect(() => {
        getConnectionStatus();
        socket.on('errors', (data) => console.log(data));
        socket.on('receiveNewDelivery', newOrder);
    }, [token]);

    return (
        <Socket.Provider value={{ socket, isEnabled, toggleSwitch }}>
            {children}
        </Socket.Provider>
    );
};

function useSocket() {
    const context = useContext(Socket);

    if (!context) {
        throw new Error('useSocket must be used within a ToastProvider');
    }

    return context;
}

export { SocketProvider, useSocket };
