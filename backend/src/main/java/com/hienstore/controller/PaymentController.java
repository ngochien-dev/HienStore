package com.hienstore.controller;

import com.hienstore.config.VNPayConfig;
import com.hienstore.entity.Order;
import com.hienstore.repository.OrderRepository;
import com.hienstore.service.PaymentService;
import com.hienstore.util.VNPayUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "VNPay Payment Management")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderRepository orderRepository;
    private final VNPayConfig vnPayConfig;

    @Operation(summary = "Create VNPay payment URL")
    @GetMapping("/create-url")
    public ResponseEntity<?> createPaymentUrl(
            @RequestParam Long orderId,
            HttpServletRequest request) {
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
                
        String paymentUrl = paymentService.createVnPayPaymentUrl(orderId, order.getTotalAmount(), request);
        
        Map<String, String> response = new HashMap<>();
        response.put("url", paymentUrl);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Handle VNPay IPN or Return")
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        
        String signValue = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashAllFields(fields));
        
        Map<String, Object> response = new HashMap<>();
        if (signValue.equals(vnp_SecureHash)) {
            String orderIdStr = request.getParameter("vnp_TxnRef");
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
            
            if (orderIdStr != null && !orderIdStr.isEmpty()) {
                Long orderId = Long.parseLong(orderIdStr);
                Order order = orderRepository.findById(orderId).orElse(null);
                
                if (order != null) {
                    if ("00".equals(vnp_ResponseCode)) {
                        // Success
                        // Update order status if it's PENDING
                        if (com.hienstore.entity.OrderStatus.PENDING.equals(order.getStatus())) {
                            order.setStatus(com.hienstore.entity.OrderStatus.PROCESSING);
                            order.setPaymentStatus(com.hienstore.entity.PaymentStatus.PAID);
                            orderRepository.save(order);
                        }
                        response.put("success", true);
                        response.put("message", "Thanh toán thành công");
                        response.put("orderId", orderId);
                    } else {
                        // Failed
                        response.put("success", false);
                        response.put("message", "Thanh toán thất bại");
                        response.put("orderId", orderId);
                    }
                } else {
                    response.put("success", false);
                    response.put("message", "Không tìm thấy đơn hàng");
                }
            }
        } else {
            response.put("success", false);
            response.put("message", "Chữ ký không hợp lệ");
        }
        
        return ResponseEntity.ok(response);
    }
    
    private String hashAllFields(Map<String, String> fields) {
        java.util.List<String> fieldNames = new java.util.ArrayList<>(fields.keySet());
        java.util.Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        java.util.Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return sb.toString();
    }
}
