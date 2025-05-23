package com.example.Mi.casita.segura.pagos.repository;

import com.example.Mi.casita.segura.pagos.model.Pago_Detalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoDetalleRepository extends JpaRepository <Pago_Detalle, Long> {

    // Buscar todos los detalles asociados a un pago específico
    List<Pago_Detalle> findByPagoId(Long pagoId);

    // Buscar detalles de pago por estado (ej: COMPLETADO, PENDIENTE)
    List<Pago_Detalle> findByEstadoPago(String estadoPago);

    // Buscar detalles de pago por tipo de servicio (ej: AGUA, CUOTA)
    List<Pago_Detalle> findByServicioPagado(String servicioPagado);

    // Puedes agregar más métodos según necesites
}

