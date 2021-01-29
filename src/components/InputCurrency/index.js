import React, {
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useCallback,
} from 'react';
import { useTheme } from 'styled-components';
import { useField } from '@unform/core';

import { Container, Currency, Icon, ErrorText } from './styles';

const InputCurrency = ({ name, icon, placeholder, ...rest }, ref) => {
    const [formattedValue, setFormattedValue] = useState();

    const inputElementRef = useRef(null);
    const { registerField, defaultValue = '', fieldName, error } = useField(
        name
    );
    const inputValueRef = useRef({ value: defaultValue });

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const { colors, shadow } = useTheme();

    const handleChange = useCallback((data) => {
        setFormattedValue(data);
        inputValueRef.current.value = data;
    }, []);

    const handleInputFocused = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);
        setIsFilled(!!inputValueRef.current.value);
    }, []);

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus();
        },
    }));

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            clearValue() {
                inputValueRef.current.value = '';
            },
        });
    }, [fieldName, registerField]);

    return (
        <>
            <Container
                isFocused={isFocused}
                isFilled={isFilled}
                isErrored={!!error}
                style={shadow}
            >
                <Icon
                    name={icon}
                    size={22}
                    color={
                        isFocused || isFilled
                            ? colors.primary
                            : colors.secundary
                    }
                    solid
                />

                <Currency
                    ref={inputElementRef}
                    placeholderTextColor={colors.secundary}
                    value={formattedValue}
                    onChangeValue={handleChange}
                    onFocus={handleInputFocused}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    unit="R$"
                    delimiter=","
                    separator=","
                    precision={2}
                    {...rest}
                />
            </Container>
            {error && <ErrorText>{error}</ErrorText>}
        </>
    );
};

export default forwardRef(InputCurrency);
