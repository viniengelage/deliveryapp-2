import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

export const auth = axios.create({
    baseURL: 'https://guardian.agoratem.com.br/api/v1',
});

export const services = axios.create({
    baseURL: 'https://agt-dvr-delivery.herokuapp.com/dvr',
    // baseURL: 'https://services.agoratem.com.br/order',
});

export const transactions = axios.create({
    baseURL: 'https://agt-trs-transaction.herokuapp.com/trs',
    // baseURL: 'https://services.agoratem.com.br/transaction',
});

export const orders = axios.create({
    baseURL: 'https://agt-ord-order.herokuapp.com/ord',
});

const getKey = async () => {
    const access_token = await AsyncStorage.getItem('access_token');
    return access_token;
};

const refreshAuthLogic = (failedRequest) =>
    axios
        .post(
            `${process.env.REACT_APP_GUARDIAN}/auth/refresh`,
            {},
            {
                headers: {
                    authorization: `Bearer ${getKey()}`,
                },
            }
        )
        .then(async (tokenRefreshResponse) => {
            await AsyncStorage.setItem(
                'access_token',
                tokenRefreshResponse.data.access_token
            );
            failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.access_token}`;
            return Promise.resolve();
        })
        .catch(async () => {
            await AsyncStorage.removeItem('access_token');
        });

const options = {
    statusCodes: [401, 403], // default: [ 401 ]
};

createAuthRefreshInterceptor(auth, refreshAuthLogic, options);
createAuthRefreshInterceptor(services, refreshAuthLogic, options);
createAuthRefreshInterceptor(transactions, refreshAuthLogic, options);
createAuthRefreshInterceptor(orders, refreshAuthLogic, options);
