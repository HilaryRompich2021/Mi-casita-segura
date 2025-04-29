package com.example.Mi.casita.segura.acceso.model;

import com.example.Mi.casita.segura.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class RegistroIngreso {

    //PK
    @Id
    //Permite que la base de datos genere el valor automáticamente
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   private LocalDateTime fecha_hora_ingreso;

    //@Enumerated(EnumType.STRING)
   private String tipo_ingreso;

    private String resultado_validacion;

    private String nombre_lector;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String observacion;

  /*  public enum TipoIngreso {
        SISTEMA, PAGO, RESERVA, SEGURIDAD
    }*/


}
