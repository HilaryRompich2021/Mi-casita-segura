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
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class CorreoService {

    private final JavaMailSender mailSender;

    //Registrar usuario nuevo, mensaje con usuario y contraseña
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

    /**
     * Envía el correo de confirmación al registrar un paquete.
     * No incluye archivos adjuntos, solo HTML en texto plano.
     */
    public void enviarRegistroPaquete(
            String correoDestino,
            String nombreResidente,
            Integer numeroCasa,
            String empresaDeEntrega,
            String numeroDeGuia,
            String tipoDePaquete,
            String observacion,
            java.time.LocalDateTime fechaRegistro,
            String codigoPaquete
    ) {
        MimeMessage mensaje = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, false, "UTF-8");
            helper.setTo(correoDestino);
            helper.setSubject("Paquete Registrado con Éxito – Código de Ingreso Generado");
            // helper.setFrom("no-reply@mi-casita-segura.com");

            String fechaFormateada = fechaRegistro.format(DateTimeFormatter.ofPattern("dd/MM/yyyy – hh:mm a"));
            String contenido = new StringBuilder()
                    .append("<h3>Registro de Paquete Exitoso</h3>")
                    .append("<p>Estimado/a <strong>").append(nombreResidente).append("</strong>,</p>")
                    .append("<p>Tu paquete ha sido registrado con éxito. A continuación los detalles:</p>")
                    .append("<ul>")
                    .append("<li><strong>Casa:</strong> ").append(numeroCasa).append("</li>")
                    .append("<li><strong>Empresa de Entrega:</strong> ").append(empresaDeEntrega).append("</li>")
                    .append("<li><strong>Número de Guía / Tracking:</strong> ").append(numeroDeGuia).append("</li>")
                    .append("<li><strong>Tipo de Paquete:</strong> ").append(tipoDePaquete).append("</li>")
                    .append("<li><strong>Observaciones:</strong> ").append(observacion).append("</li>")
                    .append("<li><strong>Fecha y Hora del Registro:</strong> ").append(fechaFormateada).append("</li>")
                    .append("</ul>")
                    .append("<p><strong>Código de Ingreso del Paquete:</strong><br/>")
                    .append("<span style='font-size:1.2em;color:#2a6ebb;font-weight:bold;'>")
                    .append(codigoPaquete)
                    .append("</span></p>")
                    .append("<p>Este código deberá ser entregado al servicio de paquetería para que pueda entregar el paquete en la garita. ")
                    .append("Una vez recibido, serás notificado nuevamente para recogerlo presentando tu código de entrega.</p>")
                    .append("<p><strong>Importante:</strong><br/>")
                    .append("• No compartas este código con terceros no autorizados.<br/>")
                    .append("• El código tiene una validez de <strong>7 DÍAS</strong>.</p>")
                    .append("<p>¡Gracias por ser parte de Mi Casita Segura!<br/>")
                    .append("Atentamente,<br/>Administración – Mi Casita Segura</p>")
                    .append("<hr/>")
                    .append("<small>Nota: Este mensaje es personal y confidencial. No compartas tu información de acceso con terceros.</small>")
                    .toString();

            helper.setText(contenido, true);
            mailSender.send(mensaje);
        } catch (MessagingException e) {
            // Aquí podrías loguear un error si fallara el envío, pero no relanzar excepción
            // para que no rompa el flujo de registrar el paquete.
            e.printStackTrace();
        }
    }

}
