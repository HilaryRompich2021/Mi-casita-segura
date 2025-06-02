package com.example.Mi.casita.segura.reservas.repository;

import com.example.Mi.casita.segura.pagos.model.Pago_Detalle;
import com.example.Mi.casita.segura.reservas.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    boolean existsByAreaComunIgnoreCaseAndFechaAndHoraInicioAndHoraFinAndEstado(
            String areaComun,
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaFin,
            Reserva.EstadoReserva estado
    );

}
