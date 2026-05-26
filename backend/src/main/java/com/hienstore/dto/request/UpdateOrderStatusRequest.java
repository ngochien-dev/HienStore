package com.hienstore.dto.request;

import com.hienstore.entity.OrderStatus;
import com.hienstore.entity.PaymentStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus status;
    private PaymentStatus paymentStatus;
}
