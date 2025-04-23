package com.example.Mi.casita.segura.reservas.model;

import com.example.Mi.casita.segura.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Área común reservada: salón, cancha, piscina, etc.
    @Column(nullable = false)
    private String areaComun;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    // Usuario que reservó (residente)
    @ManyToOne
    @JoinColumn(name = "asociado_a", referencedColumnName = "cui")
    private Usuario residente;

    // Este campo se agregará si quieres vincular reserva con detallePago
    // @OneToOne(mappedBy = "reserva")
    // private DetallePago detallePago
}
