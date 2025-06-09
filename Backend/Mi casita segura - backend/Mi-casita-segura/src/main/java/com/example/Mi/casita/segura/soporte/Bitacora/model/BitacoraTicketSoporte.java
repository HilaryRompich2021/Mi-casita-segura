package com.example.Mi.casita.segura.soporte.Bitacora.model;

import com.example.Mi.casita.segura.soporte.model.TicketSoporte;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class BitacoraTicketSoporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "TicketSoporte_id", nullable = false)
    private TicketSoporte ticketSoporte;

    @Column(nullable = false, length = 10)
    private String operacion; // CREACION, ACTUALIZACION, ELIMINACION

    @Column(nullable = false)
    private LocalDateTime fecha;
}
