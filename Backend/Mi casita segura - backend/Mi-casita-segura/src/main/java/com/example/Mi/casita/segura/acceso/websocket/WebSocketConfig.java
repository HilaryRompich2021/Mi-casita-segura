package com.example.Mi.casita.segura.acceso.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final TalanqueraWebSocketHandler handler;

    public WebSocketConfig(TalanqueraWebSocketHandler handler) {
        this.handler = handler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(handler, "/ws/talanquera")
                .setAllowedOrigins("*");   // Ajusta el CORS según tu red
    }
}