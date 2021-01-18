import React, {
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useCallback,
} from 'react';
import { useField } from '@unform/core';

import { useTheme } from 'styled-components';

import { Container, TextInput, Icon, ErrorText } from './styles';

const InputBasic = ({ name, icon, ...rest }, ref) => {
    const inputElementRef = useRef(null);
    const { registerField, defaultValue = '', fieldName, error } = useField(
        name
    );
    const inputValueRef = useRef({ value: defaultValue });

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const { colors } = useTheme();

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
        });
    }, [fieldName, registerField]);

    return (
        <>
            <Container
                isFocused={isFocused}
                isFilled={isFilled}
                isErrored={!!error}
            >
                <Icon
                    name={icon}
                    size={22}
                    color={
                        isFocused || isFilled
                            ? colors.primary
                            : colors.secundary
                    }
                />

                <TextInput
                    ref={inputElementRef}
                    keyboardAppearance="dark"
                    placeholderTextColor={colors.text}
                    onFocus={handleInputFocused}
                    onBlur={handleInputBlur}
                    onChangeText={(value) => {
                        inputValueRef.current.value = value;
                    }}
                    {...rest}
                />
            </Container>
            {error && <ErrorText>{error}</ErrorText>}
        </>
    );
};

export default forwardRef(InputBasic);
