package com.example.Mi.casita.segura.acceso.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class TalanqueraWebSocketHandler extends TextWebSocketHandler {

    // Guardamos todas las sessions abiertas
    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        // Opcional: enviar saludo
        sendTo(session, "connected");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage msg) {
        String payload = msg.getPayload();
        // Aquí puedes procesar mensajes recibidos del ESP32
        // p.ej. registroFallo
        System.out.println("[WS] recibido: " + payload);
        // … o reenviarlo a otros servicios …
    }

    // Método público para enviar a todos los clientes (tu ESP32)
    public void broadcast(String message) {
        TextMessage text = new TextMessage(message);
        sessions.forEach(s -> sendTo(s, text));
    }

    private void sendTo(WebSocketSession session, String payload) {
        sendTo(session, new TextMessage(payload));
    }
    private void sendTo(WebSocketSession session, TextMessage msg) {
        try {
            if (session.isOpen()) session.sendMessage(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}