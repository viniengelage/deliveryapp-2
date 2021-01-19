import { createRef } from 'react';

export const navigationRef = createRef();

export function navigate(name, params) {
    return navigationRef.current?.navigate(name, params);
}

export function goBack() {
    return navigationRef.current?.goBack();
}
