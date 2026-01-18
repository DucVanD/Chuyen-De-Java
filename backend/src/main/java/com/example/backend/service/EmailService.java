package com.example.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Siêu Thị Mini <noreply@sieuthimini.com>");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Mã xác thực quên mật khẩu - Siêu Thị Mini";
        String body = "Xin chào,\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n\n" +
                "Mã xác thực của bạn là: " + otp + "\n\n" +
                "Mã này có hiệu lực trong 5 phút.\n" +
                "Vui lòng KHÔNG chia sẻ mã này cho bất kỳ ai.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ Siêu Thị Mini";
        sendEmail(to, subject, body);
    }
}
