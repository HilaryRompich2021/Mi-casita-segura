package com.example.Mi.casita.segura.pagos.model.Bitacora;

import com.example.Mi.casita.segura.acceso.model.RegistroIngreso;
import com.example.Mi.casita.segura.pagos.model.Pago_Detalle;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class BitacoraPagoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Pago_Detalle_id", nullable = false)
    private Pago_Detalle pagoDetalle;

    @Column(nullable = false, length = 10)
    private String operacion; // CREACION, ACTUALIZACION, ELIMINACION

    @Column(nullable = false)
    private LocalDateTime fecha;
}
