import { useNotification } from 'hooks/notification';
import { useOrder } from 'hooks/order';
import React, { useEffect } from 'react';
import Icon from 'react-native-ionicons';
import { useTheme } from 'styled-components';

import {
    Container,
    Detail,
    Title,
    Description,
    FinalizeButton,
    FinalizeContainer,
    FinalizeText,
    CloseButton,
    ActionContainer,
    CloseContainer,
} from './styles';

const OrderDetail = ({ order, close }) => {
    const { colors } = useTheme();
    const {
        deliveryOrder,
        onLocal,
        currentOrderIndex,
        orderLength,
        hasManyOrders,
        currentOrder,
    } = useOrder();
    const { removeNotification } = useNotification();

    return (
        <Container>
            <Title>Nome do cliente</Title>
            <Description>{currentOrder.customer.name}</Description>
            <Title>Endereço</Title>
            <Description>
                {currentOrder.customer_address.street},{' '}
                {currentOrder.customer_address.number} -{' '}
                {currentOrder.customer_address.district}
            </Description>
            {currentOrder.customer.cellphone && (
                <>
                    <Title>Telefone</Title>
                    <Description>{currentOrder.customer.cellphone}</Description>
                </>
            )}
            <Title>Nome do restaurante</Title>
            <Description>{currentOrder.seller.name}</Description>
            {currentOrder.seller.cellphone && (
                <>
                    <Title>Telefone</Title>
                    <Description>{currentOrder.seller.cellphone}</Description>
                </>
            )}
            <Title>Endereço</Title>
            <Description>
                {currentOrder.seller.address.street},{' '}
                {currentOrder.seller.address.number} -{' '}
                {currentOrder.seller.address.district}
            </Description>
            <ActionContainer>
                <CloseContainer>
                    <CloseButton onPress={() => close()}>
                        <Icon
                            name="close"
                            size={18}
                            color={colors.background}
                        />
                    </CloseButton>
                </CloseContainer>
                {onLocal && (
                    <FinalizeContainer>
                        <FinalizeText>Finalizar entrega</FinalizeText>
                        <FinalizeButton
                            onPress={() => {
                                removeNotification();
                                deliveryOrder(
                                    order,
                                    currentOrderIndex,
                                    orderLength,
                                    hasManyOrders,
                                    order.id
                                );
                                close();
                            }}
                        >
                            <Icon
                                name="checkmark"
                                size={18}
                                color={colors.background}
                            />
                        </FinalizeButton>
                    </FinalizeContainer>
                )}
            </ActionContainer>
            <Detail width={220} />
        </Container>
    );
};
export default OrderDetail;
