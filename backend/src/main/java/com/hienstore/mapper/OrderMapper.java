package com.hienstore.mapper;

import com.hienstore.dto.response.OrderDto;
import com.hienstore.dto.response.OrderItemDto;
import com.hienstore.entity.Order;
import com.hienstore.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrderMapper {
    @Mapping(target = "discountAmount", source = "discountAmount")
    @Mapping(target = "couponCode", source = "couponCode")
    OrderDto toDto(Order order);
    OrderItemDto toDto(OrderItem orderItem);
}
