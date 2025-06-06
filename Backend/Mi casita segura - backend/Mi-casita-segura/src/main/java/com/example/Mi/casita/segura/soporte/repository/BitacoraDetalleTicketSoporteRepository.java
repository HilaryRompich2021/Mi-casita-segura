package com.example.Mi.casita.segura.soporte.repository;

import com.example.Mi.casita.segura.soporte.model.Bitacora.BitacoraDetalleTicketSoporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BitacoraDetalleTicketSoporteRepository extends JpaRepository<BitacoraDetalleTicketSoporte, Long> {

}