package com.example.Mi.casita.segura.reservas.controller;

import com.example.Mi.casita.segura.reservas.dto.ReservaDTO;
import com.example.Mi.casita.segura.reservas.service.ReservaService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearReserva(@RequestBody ReservaDTO dto) {
        reservaService.crearReserva(dto); // ← aquí truena si está en null
        return ResponseEntity.ok("OK");
    }

    @PostConstruct
    public void init() {
        System.out.println("ReservaController inicializado correctamente");
    }


}
