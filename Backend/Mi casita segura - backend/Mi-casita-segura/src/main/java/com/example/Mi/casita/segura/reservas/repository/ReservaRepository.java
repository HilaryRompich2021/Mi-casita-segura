package com.example.Mi.casita.segura.reservas.repository;

import com.example.Mi.casita.segura.pagos.model.Pago_Detalle;
import com.example.Mi.casita.segura.reservas.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
/*
    // Buscar reservas por el cui del usuario que las realizó
    List<Reserva> findByUsuarioCui(String cui);*/

    // Buscar por estado (ej. ACTIVA, CANCELADA, FINALIZADA)
    List<Reserva> findByResidente_Cui(String cui); // ✅ Correcto

}
