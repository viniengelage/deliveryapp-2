import React, {
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useCallback,
} from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import { useField } from '@unform/core';
import { Platform } from 'react-native';
import { useTheme } from 'styled-components';

import { Container, Icon, ErrorText } from './styles';

const InputSelect = ({ name, icon, options, placeholder, ...rest }, ref) => {
    const inputElementRef = useRef(null);

    const {
        registerField,
        defaultValue = options.length !== 0 && options[0].value,
        fieldName,
        error,
    } = useField(name);

    const inputValueRef = useRef({ value: defaultValue });

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const { colors, text, shadow } = useTheme();

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
        });
    }, [fieldName, registerField]);

    const getLabelOptions = useCallback(() => {
        const labels = [];

        options.map((option) => labels.push(option.label));

        return labels;
    }, []);

    const getValueOptions = useCallback((index) => {
        console.log(
            `ò item clicado foi ${options[index].label} e seu valor é ${options[index].value}`
        );
    }, []);

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
                <ModalDropdown
                    ref={inputElementRef}
                    defaultValue={placeholder}
                    options={getLabelOptions()}
                    textStyle={{
                        color: colors.secundary,
                        fontFamily: text.bold,
                        fontSize: 16,
                        marginLeft: 0,
                        paddingLeft: 0,
                    }}
                    dropdownTextStyle={{
                        color: colors.secundary,
                        fontFamily: text.bold,
                        fontSize: 16,
                        marginLeft: 0,
                        paddingLeft: 0,
                    }}
                    dropdownStyle={[
                        {
                            width: '70%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 12,
                            height: 100,
                        },
                        shadow,
                    ]}
                    style={{
                        position: 'relative',
                        width: '100%',
                        borderWidth: 0,
                        paddingRight: 30,
                    }}
                    onSelect={(index, item) => {
                        console.log(item);
                        setIsFilled(true);
                        setIsFocused(true);
                        getValueOptions(index);
                    }}
                />
            </Container>
            {error && <ErrorText>{error}</ErrorText>}
        </>
    );
};

export default forwardRef(InputSelect);
