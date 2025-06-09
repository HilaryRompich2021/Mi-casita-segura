package com.example.Mi.casita.segura.pagos.Bitacora.CapturaDatos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;

@Component
public class JsonUtil {
    //Para la serialización de objetos a JSON. Capturando datos nuevos y datos Anteriores como txt Json

    private final ObjectMapper mapper;

    public JsonUtil() {
        this.mapper = new ObjectMapper();

        // Registro del módulo para Java 8 fechas
       // this.mapper.registerModule(new JavaTimeModule());
        //Para que genere Json legible
        this.mapper.enable(SerializationFeature.INDENT_OUTPUT);
        this.mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }

    public String toJson(Object o){
        try{
            return mapper.writeValueAsString(o);
        } catch (Exception e){
            //e.printStackTrace();
            System.out.println("ERROR SERIALIZANDO: " + o.getClass().getSimpleName());
            return "{\\\"error\\\":\\\"no pudo serializar a JSON\\\"}";
        }

    }

}
