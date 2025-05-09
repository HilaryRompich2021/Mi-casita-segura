package com.example.Mi.casita.segura.visitantes.controller;

import com.example.Mi.casita.segura.visitantes.dto.VisitanteListadoDTO;
import com.example.Mi.casita.segura.visitantes.dto.VisitanteRegistroDTO;
import com.example.Mi.casita.segura.visitantes.model.Visitante;
import com.example.Mi.casita.segura.visitantes.service.VisitanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitantes")
@RequiredArgsConstructor
public class VisitanteController {

    private final VisitanteService visitanteService;

    @PostMapping("/registro")
    public ResponseEntity<Visitante> registrarVisitante(
            @Valid @RequestBody VisitanteRegistroDTO dto) {
        Visitante v = visitanteService.registrarVisitante(dto);
        return ResponseEntity.ok(v);
    }

    @GetMapping
    public ResponseEntity<List<VisitanteListadoDTO>> listarVisitantes() {
        return ResponseEntity.ok(visitanteService.obtenerTodosVisitantes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visitante> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody VisitanteRegistroDTO dto) {
        Visitante actualizado = visitanteService.actualizarVisitante(id, dto);
        return ResponseEntity.ok(actualizado);
    }
}
