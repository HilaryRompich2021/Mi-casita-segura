package com.example.Mi.casita.segura.pagos.model;

import com.example.Mi.casita.segura.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class Pagos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Total pagado, incluyendo cuotas o excedentes
    @Column(nullable = false)
    private BigDecimal montoTotal;

    // Fecha en que se realizó el pago
    @Column(nullable = false)
    private LocalDate fechaPago;

    // Estado del pago: COMPLETADO, PENDIENTE, ANULADO
    @Column(nullable = false, length = 20)
    private String estado;

    // Tipo de pago: RESERVA, CUOTA, REINSTALACIÓN, etc.
    @Column(length = 30)
    private String tipoPago;

    // Usuario que realizó el pago
    @ManyToOne
    @JoinColumn(name = "creado_por", referencedColumnName = "cui")
    private Usuario creadoPor;

    // Detalle de conceptos individuales dentro del pago
    @OneToMany(mappedBy = "pago", cascade = CascadeType.ALL)
    private List<Pago_Detalle> detallePagos;

}
