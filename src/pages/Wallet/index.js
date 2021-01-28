import React, { useEffect, useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { auth, transactions } from 'services/api';

import { useTransition, animated } from 'react-spring';
import { fadeIn } from 'utils/animations';
import { useAuth } from 'hooks/auth';
import { ContentContainer } from './styles';

import AddAccount from './AddAccount';
import ListAccount from './ListAccounts';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [wallets, setWallets] = useState([]);
    const [visibleAccount, setVisibleAccount] = useState(false);

    const addAccountAnimation = useTransition(visibleAccount, null, fadeIn);
    const AnimatedView = animated(ContentContainer);

    const { id } = useAuth();

    const getBalance = useCallback(async () => {
        const response = await transactions.get('/wallets');
        setBalance(response.data.data.balance);
    }, []);

    const getWallets = useCallback(async () => {
        const response = await auth.get(`users/${id}/accounts`);
        setWallets(response.data.data);
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
