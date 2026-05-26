package com.hienstore.mapper;

import com.hienstore.dto.response.CartDto;
import com.hienstore.dto.response.CartItemDto;
import com.hienstore.entity.Cart;
import com.hienstore.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CartMapper {

    @Mapping(target = "totalAmount", expression = "java(calculateTotal(cart.getItems()))")
    CartDto toDto(Cart cart);

    @Mapping(target = "subTotal", expression = "java(calculateSubTotal(cartItem))")
    CartItemDto itemToDto(CartItem cartItem);
    
    List<CartItemDto> itemsToDtoList(List<CartItem> items);

    default BigDecimal calculateSubTotal(CartItem item) {
        if (item.getProductVariant() != null && item.getProductVariant().getPrice() != null) {
            return item.getProductVariant().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        }
        return BigDecimal.ZERO;
    }

    default BigDecimal calculateTotal(List<CartItem> items) {
        if (items == null) return BigDecimal.ZERO;
        return items.stream()
                .map(this::calculateSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
