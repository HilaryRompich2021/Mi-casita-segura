package com.example.Mi.casita.segura.acceso.repository;

import com.example.Mi.casita.segura.acceso.model.RegistroIngreso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroIngresoRepository extends JpaRepository<RegistroIngreso, Long> {
    long countByAccesoQrIdAndTipoIngreso(Long accesoQrId, RegistroIngreso.TipoIngreso tipo);
}