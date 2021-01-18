export const fadeIn = {
    from: { position: 'absolute', opacity: 0, marginRight: -500 },
    enter: { opacity: 1, marginRight: 0 },
    leave: { opacity: 0, marginRight: -500 },
};

export const fadeUp = {
    from: { position: 'absolute', opacity: 0, bottom: '-600px' },
    enter: { opacity: 1, bottom: 0 },
    leave: { opacity: 0, bottom: '-600px' },
};
