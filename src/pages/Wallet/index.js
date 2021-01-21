import React, { useEffect, useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { transactions } from 'services/api';

import { useTransition, animated } from 'react-spring';
import { fadeIn } from 'utils/animations';
import { ContentContainer } from './styles';

import AddAccount from './AddAccount';
import ListAccount from './ListAccounts';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [visibleAccount, setVisibleAccount] = useState(false);
    const navigation = useNavigation();

    const addAccountAnimation = useTransition(visibleAccount, null, fadeIn);
    const AnimatedView = animated(ContentContainer);

    const getWallet = useCallback(async () => {
        const response = await transactions.get('/wallets');
        setBalance(response.data.data.balance);
    }, []);

    useEffect(() => {
        getWallet();
    }, [getWallet]);

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
