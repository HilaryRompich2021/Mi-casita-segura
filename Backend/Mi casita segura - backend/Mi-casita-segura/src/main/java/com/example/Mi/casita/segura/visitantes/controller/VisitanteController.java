package com.example.Mi.casita.segura.visitantes.controller;

import com.example.Mi.casita.segura.visitantes.dto.VisitanteRegistroDTO;
import com.example.Mi.casita.segura.visitantes.model.Visitante;
import com.example.Mi.casita.segura.visitantes.service.VisitanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visitantes")
@RequiredArgsConstructor
public class VisitanteController {

    private final VisitanteService visitanteService;

    @PostMapping("/registro")
    public ResponseEntity<Visitante> registrarVisitante(@Valid @RequestBody VisitanteRegistroDTO dto) {
        Visitante visitante = visitanteService.registrarVisitante(dto);
        return ResponseEntity.ok(visitante);
    }
}
