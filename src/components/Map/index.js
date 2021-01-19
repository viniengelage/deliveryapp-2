import React, { useRef, useEffect } from 'react';
import { Image } from 'react-native';
import { useOrder } from 'hooks/order';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';

import iconCustomer from 'assets/customer.png';

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

    const {
        locationOrders,
        locationOrder,
        centerCoordinate,
        zoom,
    } = useOrder();

    useEffect(() => {
        console.log(centerCoordinate);
    }, []);

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
                    zoomLevel={zoom}
                    centerCoordinate={[
                        userLocation.longitude,
                        userLocation.latitude,
                    ]}
                />
            )}

            {locationOrders &&
                locationOrders.map((singleOrder) => (
                    <>
                        <MapboxGL.MarkerView
                            key={singleOrder.id}
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
                        <MapboxGL.Camera
                            zoomLevel={zoom}
                            centerCoordinate={[
                                centerCoordinate.longitude,
                                centerCoordinate.latitude,
                            ]}
                        />
                    </>
                ))}

            {locationOrder.latitude && (
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
            {locationOrder.latitude && (
                <MapboxGL.Camera
                    zoomLevel={zoom}
                    centerCoordinate={
                        ([userLocation.longitude, userLocation.latitude],
                        [locationOrder.longitude, locationOrder.latitude])
                    }
                />
            )}
            <MapboxGL.UserLocation showsUserHeadingIndicator />
        </MapboxGL.MapView>
    );
};

export default Map;
