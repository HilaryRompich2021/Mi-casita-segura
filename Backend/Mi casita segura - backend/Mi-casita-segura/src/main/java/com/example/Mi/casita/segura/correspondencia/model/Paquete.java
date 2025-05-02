package com.example.Mi.casita.segura.correspondencia.model;

import com.example.Mi.casita.segura.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
public class Paquete {

    //Codigo de la empresa de paquetería a guardia
    @Id
    @Column(nullable = false, length = 50)
    private String codigo_llegada;

   /* @Column(nullable = false, length = 100)
    private String nombre_residente;*/

    //private int numero_casa;

    private String estado;

    @Column(nullable = false, length = 100)
    private String empresa_de_entrega;

    @Column(nullable = false, length = 50)
    private String numero_de_guia;

    @Column(nullable = false, length = 50)
    private String tipo_de_paquete;

    //Entrega al residente final
    @Column(nullable = false, length = 50)
    private String codigo_entrega;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String observacion;

    @Column(nullable = false)
    private LocalDateTime fecha_registro;

    @ManyToOne
    @JoinColumn(name = "creadoPor")
    private Usuario creadopor;
}
