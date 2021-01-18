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

const refreshAuthLogic = (failedRequest) =>
    axios
        .post(
            `${process.env.REACT_APP_GUARDIAN}/auth/refresh`,
            {},
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem(
                        '@AgoraTem:access_token'
                    )}`,
                },
            }
        )
        .then((tokenRefreshResponse) => {
            localStorage.setItem(
                '@AgoraTem:access_token',
                tokenRefreshResponse.data.access_token
            );
            failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.access_token}`;
            return Promise.resolve();
        })
        .catch(() => {
            localStorage.removeItem('@AgoraTem:access_token');
            localStorage.removeItem('@AgoraTem:user');
            localStorage.removeItem('@AgoraTem:role');
            return window.location('/login');
        });

createAuthRefreshInterceptor(auth, refreshAuthLogic);
createAuthRefreshInterceptor(services, refreshAuthLogic);
createAuthRefreshInterceptor(transactions, refreshAuthLogic);
