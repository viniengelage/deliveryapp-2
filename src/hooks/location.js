import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useNotification } from './notification';

const Location = createContext({});

const LocationProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState({});
    const { createNotification, removeNotification } = useNotification();

    const getPosition = useCallback(
        (options) =>
            new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(resolve, reject, options);
            }),
        []
    );

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

    useEffect(() => {
        checkPermission();
    }, []);

    return (
        <Location.Provider value={{ getPosition, userLocation }}>
            {children}
        </Location.Provider>
    );
};

function useLocation() {
    const context = useContext(Location);

    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }

    return context;
}

export { LocationProvider, useLocation };
