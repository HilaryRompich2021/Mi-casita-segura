package com.example.Mi.casita.segura.pagos.model.Bitacora;

import com.example.Mi.casita.segura.acceso.model.Bitacora.BitacoraRegistroIngreso;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class BitacoraDetallePagoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bitacoraPagoDetalle_id", nullable = false)
    private BitacoraPagoDetalle bitacoraPagoDetalle;

    @Column(nullable = false, length = 100)
    private String usuario;

    @Column(columnDefinition = "jsonb", nullable = true)
    private String datosAnteriores;

    @Column(columnDefinition = "jsonb", nullable = true)
    private String datosNuevos;
}
