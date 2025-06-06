package com.example.Mi.casita.segura.pagos.Bitacora.CapturaDatos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.stereotype.Component;

@Component
public class JsonUtil {
    //Para la serialización de objetos a JSON. Capturando datos nuevos y datos Anteriores como txt Json

    private final ObjectMapper mapper;

    public JsonUtil() {
        this.mapper = new ObjectMapper();

        //Para que genere Json legible
        this.mapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    public String toJson(Object o){
        try{
            return mapper.writeValueAsString(o);
        } catch (Exception e){

            return "{\\\"error\\\":\\\"no pudo serializar a JSON\\\"}";
        }

    }

}
