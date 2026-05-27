package com.hienstore.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hienstore.dto.request.AiChatRequest;
import com.hienstore.dto.request.AiMessage;
import com.hienstore.entity.Product;
import com.hienstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService(ProductRepository productRepository) {
        this.productRepository = productRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String generateChatResponse(AiChatRequest request) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return "Xin lỗi, API Key của Gemini chưa được cấu hình. Vui lòng liên hệ Admin.";
        }

        try {
            // 1. Build context from top products
            List<Product> topProducts = productRepository.findAll().stream()
                    .filter(p -> p.getIsPublished() != null && p.getIsPublished())
                    .limit(10)
                    .collect(Collectors.toList());

            StringBuilder storeContext = new StringBuilder();
            storeContext.append("Bạn là nhân viên tư vấn ảo của cửa hàng thời trang HienStore. Bạn nhiệt tình, thân thiện và trả lời bằng tiếng Việt. ");
            storeContext.append("Dưới đây là một số sản phẩm nổi bật hiện có trong kho để bạn tư vấn cho khách:\n");

            for (Product p : topProducts) {
                storeContext.append(String.format("- %s: giá %s VND\n", p.getName(), p.getBasePrice().longValue()));
            }

            storeContext.append("\nKhi khách hàng hỏi về các sản phẩm, hãy dựa vào thông tin trên để tư vấn. Nếu khách hỏi sản phẩm không có, hãy lịch sự báo không có. Đừng chếa ra sản phẩm. Chỉ trả lời ngắn gọn, súc tích (tối đa 3-4 câu).");

            // 2. Build Request Body for Gemini API
            Map<String, Object> requestBody = new HashMap<>();

            // System Instruction
            Map<String, Object> systemInstruction = new HashMap<>();
            systemInstruction.put("parts", List.of(Map.of("text", storeContext.toString())));
            requestBody.put("system_instruction", systemInstruction);

            // Contents (History)
            List<Map<String, Object>> contents = new ArrayList<>();
            for (AiMessage msg : request.getMessages()) {
                Map<String, Object> content = new HashMap<>();
                content.put("role", msg.getRole().equals("user") ? "user" : "model");
                content.put("parts", List.of(Map.of("text", msg.getContent())));
                contents.add(content);
            }
            requestBody.put("contents", contents);

            // 3. Make REST Call
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String fullUrl = geminiApiUrl + geminiApiKey;

            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, entity, Map.class);

            // 4. Parse Response
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }

            return "Xin lỗi, tôi không thể xử lý câu hỏi lúc này.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Có lỗi xảy ra khi kết nối tới AI: " + e.getMessage();
        }
    }
}
