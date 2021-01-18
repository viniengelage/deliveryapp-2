import React, {
    useRef,
    useEffect,
    useCallback,
    useState,
    useImperativeHandle,
    forwardRef,
} from 'react';
import { useField } from '@unform/core';
import { Container, Icon, TextInput } from './styles';

function Input({ name, onChangeText, rawValue, icon, ...rest }, ref) {
    const inputElementRef = useRef(null);
    const { registerField, defaultValue = '', fieldName, error } = useField(
        name
    );
    const inputValueRef = useRef({ value: defaultValue });

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        inputValueRef.current.value = defaultValue;
        if (onChangeText) onChangeText(defaultValue);
    }, [defaultValue]);

    const handleOnChange = useCallback(
        (text) => {
            if (inputValueRef.current) inputValueRef.current.value = text;
            if (onChangeText) onChangeText(text);
        },
        [onChangeText]
    );

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
            setValue(ref, value) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({ text: value });
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear();
            },
            getValue(ref) {
                return rawValue || ref.value;
            },
        });
    }, [fieldName, rawValue, registerField]);

    return (
        <Container
            isFocused={isFocused}
            isFilled={isFilled}
            isErrored={!!error}
        >
            <Icon
                name={icon}
                size={20}
                color={isFocused || isFilled ? '#fff' : '#CECECE'}
            />

            <TextInput
                ref={inputElementRef}
                keyboardAppearance="dark"
                placeholderTextColor="#CECECE"
                onChangeText={handleOnChange}
                onFocus={handleInputFocused}
                onBlur={handleInputBlur}
                {...rest}
            />
        </Container>
    );
}

export default forwardRef(Input);
