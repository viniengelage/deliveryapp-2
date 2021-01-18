import React, { useRef, useEffect } from 'react';
import { Image } from 'react-native';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import { useOrder } from 'hooks/order';

import iconCustomer from 'assets/customer.png';

Logger.setLogCallback((log) => {
    const { message } = log;
    if (
        message.match('Request failed due to a permanent error: Canceled') ||
        message.match('Request failed due to a permanent error: Socket Closed')
    ) {
        return true;
    }
    return false;
});

const Map = ({ userLocation }) => {
    const mapRef = useRef(null);

    const { locationOrders } = useOrder();

    useEffect(() => {
        console.log(locationOrders);
    }, []);

    MapboxGL.setAccessToken(
        'sk.eyJ1IjoibWFrZXBybyIsImEiOiJja2sxYzBlMG4wbWJzMnZvdGJjcG5vMnl1In0.NTukMNryrS_YoREYRPDctw'
    );
    MapboxGL.setConnected(true);
    return (
        <MapboxGL.MapView
            id="map"
            style={{ flex: 1, zIndex: 3 }}
            compassEnabled
            ref={mapRef}
            onDidFinishRenderingMapFully={() => {
                console.log('init map');
            }}
        >
            {userLocation && (
                <MapboxGL.Camera
                    zoomLevel={18}
                    centerCoordinate={[
                        userLocation.longitude,
                        userLocation.latitude,
                    ]}
                />
            )}

            {locationOrders &&
                locationOrders.map((singleOrder) => (
                    <MapboxGL.MarkerView
                        coordinate={[
                            singleOrder.longitude,
                            singleOrder.latitude,
                        ]}
                    >
                        <Image
                            source={iconCustomer}
                            style={{ width: 32, height: 32 }}
                            resizeMode="contain"
                        />
                    </MapboxGL.MarkerView>
                ))}

            <MapboxGL.UserLocation showsUserHeadingIndicator />
        </MapboxGL.MapView>
    );
};

export default Map;
