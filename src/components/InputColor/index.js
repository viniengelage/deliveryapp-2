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
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import { Modal } from 'react-native';

import Button from 'components/Button';
import {
    Container,
    Icon,
    ErrorText,
    Placeholder,
    Color,
    PickerContainer,
    TooltipContainer,
    TooltipText,
} from './styles';

const InputSelect = ({ name, icon, options, placeholder, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState('#c53030');
    const changeColor = (data) => {
        const inputColor = fromHsv({ h: data.h, s: data.s, v: data.v });
        setColor(inputColor);
        inputValueRef.current.value = inputColor;
    };

    const inputElementRef = useRef(null);

    const { registerField, defaultValue = '', fieldName, error } = useField(
        name
    );

    const inputValueRef = useRef({ value: defaultValue });

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const { colors } = useTheme();

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
                onPress={() => setVisible(true)}
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
                <Placeholder>{placeholder}</Placeholder>

                <Color name="circle" color={color} size={32} solid />
            </Container>
            <Modal transparent visible={visible}>
                <PickerContainer>
                    <ColorPicker
                        color={color}
                        onColorChange={changeColor}
                        onColorSelected={(colorParam) => {
                            setIsFocused(true);
                            setIsFilled(true);
                            setColor(colorParam);
                            setVisible(false);
                        }}
                        style={{ height: 200, marginBottom: 20 }}
                        hideSliders
                    />
                    <TooltipContainer>
                        <TooltipText>
                            Para selecionar a cor escolhida, clique no circulo
                            central.
                        </TooltipText>
                    </TooltipContainer>
                </PickerContainer>
            </Modal>
            {error && <ErrorText>{error}</ErrorText>}
        </>
    );
};

export default forwardRef(InputSelect);
