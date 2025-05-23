package com.example.Mi.casita.segura.Correo.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CorreoService {

    private final JavaMailSender mailSender;

    public void enviarBienvenida(String correoDestino, String nombre, String usuario, String contrasena, BufferedImage qrImage)
            throws MessagingException, IOException {

        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

        helper.setTo(correoDestino);
        helper.setSubject("¡Bienvenido a Mi Casita Segura! Aquí están tus credenciales y QR de acceso");

        String contenido = """
            <h3>Estimado/a %s,</h3>
            <p>¡Bienvenido/a a <strong>Mi Casita Segura</strong>! Tu cuenta ha sido creada exitosamente.</p>
            <p><strong>Usuario:</strong> %s<br/>
               <strong>Contraseña:</strong> %s</p>
            <p>Accede a la plataforma: <a href="https://app.mi-casita-segura.com/login">Ir a la aplicación</a></p>
            <p><strong>Tu Código QR para Ingreso al Residencial:</strong></p>
            <img src='cid:qr' />
            <p><strong style='color:red;'>IMPORTANTE:</strong> No compartas este mensaje ni tu QR con nadie.</p>
            <p>Gracias por ser parte de Mi Casita Segura.<br/>Administración</p>
            """.formatted(nombre, usuario, contrasena);

        helper.setText(contenido, true);

        // Adjuntar el QR
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "png", baos);
        ByteArrayResource qrResource = new ByteArrayResource(baos.toByteArray());

        helper.addInline("qr", qrResource, "image/png");

        mailSender.send(mensaje);
    }
}
