package com.example.Mi.casita.segura.acceso.controller;

import com.example.Mi.casita.segura.acceso.service.AccesoQRService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/acceso")
public class AccesoQRController {

    private final AccesoQRService service;

    public AccesoQRController(AccesoQRService service) {
        this.service = service;
    }

    @PostMapping("/{codigo}")
    public ResponseEntity<Void> validar(@PathVariable String codigo) {
        service.procesarCodigo(codigo);
        return ResponseEntity.ok().build();
    }
}