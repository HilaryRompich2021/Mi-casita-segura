package com.example.Mi.casita.segura.soporte.model;

import com.example.Mi.casita.segura.usuarios.model.Usuario;
import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class TicketSoporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Categoría del problema (APP, SEGURIDAD, OTRO)
    @Column(nullable = false, length = 50)
    private String tipoError;

    //Descripcion detallada del problema
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    // Estado actual: PENDIENTE, EN_PROCESO, RESUELTO
    @Column(nullable = false, length = 20)
    private String estado;

    // Fecha y hora de creación del ticket
    @Column(nullable = false)
    private LocalDate fechacreacion;

    @Column(nullable = false)
    private LocalDateTime fechaActualizacion; //

    //usuario que genera el ticket
    @ManyToOne
    @JoinColumn(name = "usuario_cui", referencedColumnName = "cui")
    private Usuario usuario;

    /*// Método auxiliar si deseas actualizar la fecha automáticamente
    @PreUpdate
    public void actualizarFecha() {
        this.fechaActualizacion = LocalDateTime.now();

*/
    }
