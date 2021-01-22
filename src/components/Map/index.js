import React, { Fragment, useRef } from 'react';
import { Image } from 'react-native';
import { useOrder } from 'hooks/order';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';

import iconCustomer from 'assets/customer.png';
import { useEffect } from 'react/cjs/react.development';

MapboxGL.setAccessToken(
    'sk.eyJ1IjoibWFrZXBybyIsImEiOiJja2sycTVhbHUxM3doMm50MXY2cGMyNm1vIn0.5dAXsTBgBJrFsuXWNtjGvg'
);
MapboxGL.setConnected(true);

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

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const {
        locationOrders,
        locationOrder,
        centerCoordinate,
        zoom,
    } = useOrder();

    return (
        <MapboxGL.MapView
            id="map"
            style={{ flex: 1, zIndex: 3 }}
            compassEnabled
            ref={mapRef}
        >
            {!isEmpty(userLocation) && (
                <MapboxGL.Camera
                    zoomLevel={zoom}
                    centerCoordinate={[
                        userLocation.longitude,
                        userLocation.latitude,
                    ]}
                />
            )}

            {!isEmpty(locationOrder) && (
                <>
                    <MapboxGL.MarkerView
                        coordinate={[
                            locationOrder.longitude,
                            locationOrder.latitude,
                        ]}
                    >
                        <Image
                            source={iconCustomer}
                            style={{ width: 32, height: 32 }}
                            resizeMode="contain"
                        />
                    </MapboxGL.MarkerView>
                    <MapboxGL.Camera
                        zoomLevel={zoom}
                        centerCoordinate={[
                            centerCoordinate.longitude,
                            centerCoordinate.latitude,
                        ]}
                    />
                </>
            )}
            {!isEmpty(locationOrder) && (
                <MapboxGL.Camera
                    zoomLevel={zoom}
                    centerCoordinate={
                        ([
                            Number(userLocation.longitude),
                            Number(userLocation.latitude),
                        ],
                        [
                            Number(locationOrder.longitude),
                            Number(locationOrder.latitude),
                        ])
                    }
                />
            )}

            {locationOrders.length !== 0 && (
                <>
                    {locationOrders.map((singleOrder) => (
                        <Fragment key={singleOrder.id}>
                            <MapboxGL.MarkerView
                                coordinate={[
                                    locationOrder.longitude,
                                    locationOrder.latitude,
                                ]}
                            >
                                <Image
                                    source={iconCustomer}
                                    style={{ width: 32, height: 32 }}
                                    resizeMode="contain"
                                />
                            </MapboxGL.MarkerView>
                            <MapboxGL.Camera
                                zoomLevel={zoom}
                                centerCoordinate={[
                                    centerCoordinate.longitude,
                                    centerCoordinate.latitude,
                                ]}
                            />
                        </Fragment>
                    ))}
                </>
            )}
            <MapboxGL.UserLocation showsUserHeadingIndicator />
        </MapboxGL.MapView>
    );
};

export default Map;
