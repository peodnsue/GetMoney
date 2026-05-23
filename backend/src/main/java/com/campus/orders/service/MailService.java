package com.campus.orders.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private VerifyCodeService verifyCodeService;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    public void sendVerificationCode(String to) {
        String code = generateCode();

        verifyCodeService.sendCode(to, code);

        if (!mailEnabled) {
            System.out.println("【邮件功能已禁用】邮件验证码已生成但未发送: email=" + to + ", code=" + code);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("getmoney<3548496252@qq.com>");
        message.setTo(to);
        message.setSubject("GETMoney邮箱验证码");
        message.setText(buildEmailContent(code));

        try {
            mailSender.send(message);
            System.out.println("【邮件已发送】验证码已发送到邮箱: email=" + to);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("邮件发送失败");
        }
    }

    private String generateCode() {
        int code = (int) ((Math.random() * 9 + 1) * 100000);
        return String.valueOf(code);
    }

    private String buildEmailContent(String code) {
        return "尊敬的用户：您好！\n\n" +
                "本次请求的邮箱验证码为：" + code +
                "本验证码在5分钟内有效，请及时输入。(请勿泄露此验证码)\n\n" +
                "如非本人操作，请忽略该邮件。\n" +
                "(这是一封自动发送的邮件，请不要直接回复)";
    }
}
