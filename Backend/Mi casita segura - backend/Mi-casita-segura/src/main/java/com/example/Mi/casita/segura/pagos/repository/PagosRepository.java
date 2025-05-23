package com.example.Mi.casita.segura.pagos.repository;

import com.example.Mi.casita.segura.pagos.model.Pagos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PagosRepository extends JpaRepository<Pagos, Long> {

    // Buscar todos los pagos realizados por un usuario (por CUI)
    //List<Pagos> findByCreadoPor_Cui(String cui, Pagos.EstadoDelPago estado ) ;

    // Buscar pagos por estado (COMPLETADO, PENDIENTE, ANULADO)
    List<Pagos> findByEstado(Pagos.EstadoDelPago estado);


    // Buscar pagos por tipo de método de pago (CUOTA, RESERVA, etc.)
    List<Pagos> findByMetodoPago(String metodoPago);

    // Buscar pagos por fecha exacta
    List<Pagos> findByFechaPago(LocalDate fecha);

    // Buscar pagos entre fechas
    List<Pagos> findByFechaPagoBetween(LocalDate desde, LocalDate hasta);

    /*// Combinaciones útiles
    List<Pagos> findByCreadoPor_CuiAndEstado(String cui, Pagos.EstadoDelPago estado);*/

    List<Pagos> findByCreadoPor_Cui(String cui);


    List<Pagos> findByCreadoPor_CuiAndEstado(String cui, Pagos.EstadoDelPago estado);

    //List<Pagos> findByCreadoPor_Cui(String cui);




    //verificar que no exista una cuota en el mes y año actual para el usuario


    @Query("SELECT COUNT(p) > 0 FROM Pagos p WHERE p.creadoPor.cui = :cui " +
            "AND MONTH(p.fechaPago) = :mes AND YEAR(p.fechaPago) = :anio " +
            "AND p.estado = 'PENDIENTE'")
    boolean existsByCreadoPorAndMesAndAnio(
            @Param("cui") String cui,
            @Param("mes") int mes,
            @Param("anio") int anio
    );

    @Query("""
    SELECT COUNT(pd) FROM Pago_Detalle pd
    WHERE pd.pago.creadoPor.cui = :cui
    AND pd.servicioPagado = 'CUOTA'
    AND pd.estadoPago = 'PENDIENTE'
""")
    int contarCuotasPendientesPorUsuario(@Param("cui") String cui);

    List<Pagos> findByCreadoPorCui(String cui);
}

