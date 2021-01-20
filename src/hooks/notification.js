import React, { createContext, useContext, useCallback, useState } from 'react';

import Notication from 'components/Notification';

const NoticationContext = createContext({});

const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({});

    const createNotification = useCallback(
        ({
            type,
            text,
            buttonText,
            buttonAction,
            withBackground,
            description,
        }) => {
            const infos = {
                type,
                text,
                buttonText,
                buttonAction,
                withBackground,
                description,
            };

            setNotification(infos);
        },
        []
    );

    const removeNotification = useCallback(() => {
        setNotification({});
    }, []);

    return (
        <NoticationContext.Provider
            value={{
                createNotification,
                removeNotification,
            }}
        >
            {children}
            <Notication
                type={notification.type}
                text={notification.text}
                buttonText={notification.buttonText}
                buttonAction={notification.buttonAction}
                withBackground={notification.withBackground}
                description={notification.description}
            />
        </NoticationContext.Provider>
    );
};

function useNotification() {
    const context = useContext(NoticationContext);

    if (!context) {
        throw new Error('useNotification must be used within a ToastProvider');
    }

    return context;
}

export { NotificationProvider, useNotification, NoticationContext };
