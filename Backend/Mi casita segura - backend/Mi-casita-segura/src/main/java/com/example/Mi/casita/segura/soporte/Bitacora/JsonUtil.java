package com.example.Mi.casita.segura.soporte.Bitacora;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

public class JsonUtil {
    private final ObjectMapper mapper;

    public JsonUtil() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule()); // <- NECESARIO
        this.mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.mapper.enable(SerializationFeature.INDENT_OUTPUT);
        this.mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }

    public String toJson(Object o) {
        try {
            return mapper.writeValueAsString(o);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"no pudo serializar a JSON\"}";
        }
    }
}
