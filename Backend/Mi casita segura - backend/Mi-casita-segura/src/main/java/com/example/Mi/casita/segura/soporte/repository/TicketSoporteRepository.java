package com.example.Mi.casita.segura.soporte.repository;

import com.example.Mi.casita.segura.soporte.model.TicketSoporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketSoporteRepository extends JpaRepository<TicketSoporte, Long> {

    void deleteByUsuario_Cui(String cui);


}
