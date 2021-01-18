import React, { createContext, useContext, useState } from 'react';
import LoadingContainer from 'components/Loading';

const Loading = createContext({});

const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <Loading.Provider
            value={{
                loading,
                setLoading,
            }}
        >
            {children}
            {loading && <LoadingContainer />}
        </Loading.Provider>
    );
};

function useLoading() {
    const context = useContext(Loading);

    if (!context) {
        throw new Error('useLoading must be used within a ToastProvider');
    }

    return context;
}

export { LoadingProvider, useLoading };
