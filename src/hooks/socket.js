import React, { createContext, useContext, useState, useEffect } from 'react';

import useSocketIo from 'use-socket.io-client';
import { useOrder } from './order';

const Socket = createContext({});

const SocketProvider = ({ token, children }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const { newOrder } = useOrder();

    const Ip = 'ws://agt-dvr-delivery.herokuapp.com/dvr';
    const config = {
        autoConnect: false,
        transports: ['polling', 'websocket'],
        transportOptions: {
            polling: {
                extraHeaders: {
                    authorization: `${token}`,
                },
            },
        },
    };
    const [socket] = useSocketIo(Ip, config);

    const toggleSwitch = async () => {
        if (!isEnabled) {
            socket.connect();
            socket.on('connect', () => {
                setIsEnabled(true);
                console.log(socket.connected);
            });
        } else {
            socket.disconnect();
            setIsEnabled(false);
        }
    };

    useEffect(() => {
        socket.on('receiveNewDelivery', newOrder);
    }, []);

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
