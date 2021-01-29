import React, { useEffect, useCallback, useState } from 'react';
import { formatNumber } from 'react-native-currency-input';

import { auth, transactions } from 'services/api';

import { useTransition, animated } from 'react-spring';
import { fadeIn } from 'utils/animations';
import { useAuth } from 'hooks/auth';
import { ContentContainer } from './styles';

import AddAccount from './AddAccount';
import ListAccount from './ListAccounts';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [token, setToken] = useState('');
    const [wallets, setWallets] = useState([]);
    const [visibleAccount, setVisibleAccount] = useState(false);

    const addAccountAnimation = useTransition(visibleAccount, null, fadeIn);
    const AnimatedView = animated(ContentContainer);

    const { id } = useAuth();

    const getBalance = useCallback(async () => {
        try {
            const response = await transactions.patch('/wallets');
            setBalance(
                formatNumber(response.data.data.balance, {
                    separator: ',',
                    precision: 2,
                    delimiter: '.',
                    ignoreNegative: true,
                })
            );
            setToken(response.data.data.token);
        } catch (error) {
            console.log(error.response.data);
        }
    }, []);

    const getWallets = useCallback(async () => {
        try {
            const response = await auth.get(`users/${id}/accounts`);
            setWallets(response.data.data);
        } catch (error) {
            console.log(error.response.data);
        }
    });

    useEffect(() => {
        getBalance();
        getWallets();
    }, [getBalance]);

    return (
        <>
            {addAccountAnimation.map(({ item, props, key }) =>
                item ? (
                    <AnimatedView style={props} key={key}>
                        <AddAccount addAccount={setVisibleAccount} />
                    </AnimatedView>
                ) : (
                    <AnimatedView style={props} key={key}>
                        <ListAccount
                            token={token}
                            wallets={wallets}
                            balance={balance}
                            addAccount={setVisibleAccount}
                        />
                    </AnimatedView>
                )
            )}
        </>
    );
};
export default Wallet;
