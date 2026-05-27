package com.hienstore.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates HTML format
            
            javaMailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
        }
    }

    @Async
    public void sendOrderConfirmationEmail(String to, String customerName, String orderCode, double totalAmount) {
        String subject = "Xác nhận Đơn hàng #" + orderCode + " từ HienStore";
        String htmlBody = "<html><body>"
                + "<h2>Xin chào " + customerName + ",</h2>"
                + "<p>Cảm ơn bạn đã đặt hàng tại HienStore!</p>"
                + "<p>Đơn hàng của bạn mang mã số <strong>" + orderCode + "</strong> đã được hệ thống ghi nhận thành công.</p>"
                + "<p>Tổng giá trị đơn hàng: <strong>" + String.format("%,.0f VNĐ", totalAmount) + "</strong></p>"
                + "<br/>"
                + "<p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để tiến hành giao hàng.</p>"
                + "<p>Trân trọng,<br/>Đội ngũ HienStore</p>"
                + "</body></html>";
                
        sendHtmlEmail(to, subject, htmlBody);
    }
    
    @Async
    public void sendPasswordResetEmail(String to, String resetToken) {
        String subject = "Yêu cầu khôi phục mật khẩu - HienStore";
        String htmlBody = "<html><body>"
                + "<h2>Khôi phục mật khẩu</h2>"
                + "<p>Bạn đã gửi yêu cầu khôi phục mật khẩu cho tài khoản tại HienStore.</p>"
                + "<p>Mã khôi phục mật khẩu của bạn là: <strong>" + resetToken + "</strong></p>"
                + "<br/>"
                + "<p>Vui lòng nhập mã này trên trang web để thiết lập mật khẩu mới. Mã có hiệu lực trong vòng 15 phút.</p>"
                + "<p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>"
                + "<p>Trân trọng,<br/>Đội ngũ HienStore</p>"
                + "</body></html>";
                
        sendHtmlEmail(to, subject, htmlBody);
    }
    
    @Async
    public void sendReviewReplyEmail(String to, String customerName, String productName, String replyText) {
        String subject = "Phản hồi từ HienStore cho đánh giá của bạn";
        String htmlBody = "<html><body>"
                + "<h2>Xin chào " + customerName + ",</h2>"
                + "<p>Cảm ơn bạn đã đánh giá sản phẩm <strong>" + productName + "</strong>.</p>"
                + "<p>Quản trị viên HienStore vừa phản hồi lại đánh giá của bạn với nội dung sau:</p>"
                + "<blockquote style='border-left: 4px solid #ccc; padding-left: 10px; color: #555;'>"
                + replyText
                + "</blockquote>"
                + "<p>Trân trọng,<br/>Đội ngũ HienStore</p>"
                + "</body></html>";
                
        sendHtmlEmail(to, subject, htmlBody);
    }
}
