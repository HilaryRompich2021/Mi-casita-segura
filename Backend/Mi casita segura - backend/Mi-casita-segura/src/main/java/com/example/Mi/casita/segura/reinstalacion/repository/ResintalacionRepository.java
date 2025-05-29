package com.example.Mi.casita.segura.reinstalacion.repository;

import com.example.Mi.casita.segura.reinstalacion.model.ReinstalacionServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResintalacionRepository  extends JpaRepository<ReinstalacionServicio, Long> {

}
