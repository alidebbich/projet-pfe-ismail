package com.uib.pulse.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("Réinitialisation de votre mot de passe - UIB Pulse");
            
            String htmlContent = buildEmailTemplate(resetLink);
            helper.setText(htmlContent, true);
            
            // Generic from address, or you can use mailUsername if you prefer
            helper.setFrom("noreply@uib-pulse.com");
            
            javaMailSender.send(message);
            log.info("Password reset email sent successfully to {}", to);
        } catch (MessagingException | MailException e) {
            log.error("Failed to send password reset email to {}. But here is the reset link to test: {}", to, resetLink, e);
        }
    }

    private String buildEmailTemplate(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    .header { background-color: #E20032; padding: 30px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; }
                    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
                    .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
                    .btn-container { text-align: center; margin: 35px 0; }
                    .btn { background-color: #E20032; color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; display: inline-block; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="color: white;">UIB PULSE</h1>
                    </div>
                    <div class="content">
                        <div class="title">Réinitialisation de mot de passe</div>
                        <p>Bonjour,</p>
                        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte UIB Pulse. Si vous êtes à l'origine de cette demande, veuillez cliquer sur le bouton ci-dessous pour configurer un nouveau mot de passe.</p>
                        
                        <div class="btn-container">
                            <a href="%s" class="btn" style="color: white;">Réinitialiser mon mot de passe</a>
                        </div>
                        
                        <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
                        <p style="word-break: break-all; color: #6b7280; font-size: 13px;">%s</p>
                        
                        <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer cet email en toute sécurité. Ce lien expirera dans 15 minutes.</p>
                    </div>
                    <div class="footer">
                        &copy; %d Union Internationale de Banques. Tous droits réservés.
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink, Year.now().getValue());
    }
}
