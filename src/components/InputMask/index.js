import React, {
    useState,
    useCallback,
    useRef,
    useImperativeHandle,
} from 'react';
import { TextInputMask } from 'react-native-masked-text';
import Input from 'components/Input';

const InputMask = ({ type, icon, ...rest }) => {
    const [value, setValue] = useState('');
    const [rawValue, setRawValue] = useState('');
    const inputElementRef = useRef(null);
    const handleOnChangeText = useCallback((maskedValue, unmaskedValue) => {
        setValue(maskedValue);
        setRawValue(unmaskedValue);
    }, []);

    // useImperativeHandle(ref, () => ({
    //     focus() {
    //         inputElementRef.current.focus();
    //     },
    // }));

    return (
        <TextInputMask
            ref={inputElementRef}
            type="cpf"
            includeRawValueInChangeText
            value={value}
            onChangeText={handleOnChangeText}
            customTextInput={Input}
            customTextInputProps={{
                icon,
                rawValue,
                ...rest,
            }}
            {...rest}
        />
    );
};
export default InputMask;
