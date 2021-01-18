import React, {
    createContext,
    useCallback,
    useContext,
    useState,
    useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { auth, services, transactions } from '../services/api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    async function loadStoragedData() {
        const [access_token, user, status, id] = await AsyncStorage.multiGet([
            'access_token',
            'user',
            'status',
            'id',
        ]);

        if (access_token[1] && user[1] && status[1] && id[1]) {
            auth.defaults.headers.authorization = `Bearer ${access_token[1]}`;
            services.defaults.headers.authorization = `Bearer ${access_token[1]}`;
            transactions.defaults.headers.authorization = `Bearer ${access_token[1]}`;
            setData({
                access_token: access_token[1],
                user: JSON.parse(user[1]),
                status: status[1],
                id: id[1],
            });
        }

        setLoading(false);
    }

    useEffect(() => {
        loadStoragedData();
    }, []);

    const signIn = useCallback(async ({ email, password }) => {
        setData({});
        const response = await auth.post('/auth/login', {
            email,
            password,
        });

        const { access_token } = response.data;
        auth.defaults.headers.authorization = `Bearer ${access_token}`;
        services.defaults.headers.authorization = `Bearer ${access_token}`;
        transactions.defaults.headers.authorization = `Bearer ${access_token}`;

        const responseMe = await auth.get('auth/me');

        const user = responseMe.data;
        const { status, id } = responseMe.data.user;

        await AsyncStorage.multiSet([
            ['access_token', access_token],
            ['status', status],
            ['id', id.toString()],
            ['user', JSON.stringify(user)],
        ]);

        setData({ access_token, user, status, id });
    }, []);

    const signOut = useCallback(async () => {
        try {
            await auth.post(
                '/auth/logout',
                {},
                {
                    headers: {
                        authorization: `Bearer ${data.access_token}`,
                    },
                }
            );
            await AsyncStorage.multiRemove([
                'access_token',
                'user',
                'status',
                'id',
            ]);
            setData({});
        } catch (error) {
            await AsyncStorage.multiRemove([
                'access_token',
                'user',
                'status',
                'id',
            ]);
            setData({});
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                access_token: data.access_token,
                user: data.user,
                status: data.status,
                id: parseInt(data.id, 10),
                loading,
                setLoading,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth, AuthContext };
