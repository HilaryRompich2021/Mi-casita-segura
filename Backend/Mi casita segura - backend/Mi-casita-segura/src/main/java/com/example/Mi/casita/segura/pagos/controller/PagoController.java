package com.example.Mi.casita.segura.pagos.controller;

import com.example.Mi.casita.segura.pagos.dto.PagoConsultaDTO;
import com.example.Mi.casita.segura.pagos.dto.PagoRequestDTO;
import com.example.Mi.casita.segura.pagos.model.Pagos;
import com.example.Mi.casita.segura.pagos.repository.PagosRepository;
import com.example.Mi.casita.segura.pagos.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@Controller
@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;
    private final PagosRepository pagosRepo;
    //private final Pagos pagos;

    @PreAuthorize("hasRole('RESIDENTE') or hasRole('ADMINISTRADOR')")
    @PostMapping("/registrarPago")
    public ResponseEntity<?> registrar(@Valid @RequestBody PagoRequestDTO dto) {
        try {
            Pagos pago = pagoService.registrarPago(dto);
            return ResponseEntity.ok(pago);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pendientes/{cui}")
    public ResponseEntity<List<Pagos>> obtenerPagosPendientes(@PathVariable String cui) {
        List<Pagos> pagos = pagosRepo.findByCreadoPor_CuiAndEstado(cui, Pagos.EstadoDelPago.PENDIENTE);
        return ResponseEntity.ok(pagos);
    }

    @PreAuthorize("hasRole('RESIDENTE') or hasRole('ADMINISTRADOR')")
    @GetMapping("/todos/{cui}")
    public List<Pagos> obtenerTodosLosPagos(@PathVariable String cui) {
        //return pagosRepo.findByCreadoPor_Cui(cui);
        return pagoService.obtenerPagosPorUsuario(cui);
    }

    @GetMapping(value ="/listar/{cui}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PagoConsultaDTO>> listarPagos(@PathVariable String cui) {
        List<PagoConsultaDTO> pagos = pagoService.obtenerPagosPorCui(cui);
        return ResponseEntity.ok(pagos);
    }


}
