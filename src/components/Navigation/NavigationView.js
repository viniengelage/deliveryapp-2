import React from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';

const MapboxNavigation = (props) => (
    <RNMapboxNavigation style={styles.flexIt} {...props} />
);

const RNMapboxNavigation = requireNativeComponent(
    'MapboxNavigation',
    MapboxNavigation
);

const styles = StyleSheet.create({
    flexIt: {
        flex: 1,
    },
});

export default MapboxNavigation;

// origin: PropTypes.array.isRequired,
// destination: PropTypes.array.isRequired,
// shouldSimulateRoute: PropTypes.bool,
// onProgressChange: PropTypes.func,
// onError: PropTypes.func,
// onRoutesReady: PropTypes.func,
