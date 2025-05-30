package com.example.Mi.casita.segura.pagos.service;

import com.example.Mi.casita.segura.pagos.model.Pago_Detalle;
import com.example.Mi.casita.segura.pagos.model.Pagos;
import com.example.Mi.casita.segura.pagos.repository.PagoDetalleRepository;
import com.example.Mi.casita.segura.pagos.repository.PagosRepository;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class generarCuotasMensuales {

    private final UsuarioRepository usuarioRepo;
    private final PagosRepository pagosRepo;
    private final PagoDetalleRepository pagoDetalleRepo;


    //@Scheduled(cron = "0 0 0 20 * ?") // Cada 20 del mes
    @Scheduled(cron = "0 * * * * ?")
    public void generarCuotasMensuales() {
        List<Usuario> residentes = usuarioRepo.findByRol(Usuario.Rol.RESIDENTE);

        // ✅ LOG para verificar que el método se está ejecutando
        System.out.println("⏳ Ejecutando generación automática de cuota para: " + LocalDate.now());


        for (Usuario residente : residentes) {
            LocalDate hoy = LocalDate.now();

            //Simular más pagos pendientes para la reinstalación
            boolean yaTiene = pagosRepo.existsByCreadoPorAndMesAndAnio(residente.getCui(), hoy.getMonthValue(), hoy.getYear());
//el if para simular
            if (!yaTiene) {
                Pagos cuota = new Pagos();
                cuota.setMontoTotal(new BigDecimal("550.00"));
                cuota.setFechaPago(hoy); // fecha de emisión
                cuota.setEstado(Pagos.EstadoDelPago.PENDIENTE);
                cuota.setMetodoPago("TARJETA");
                cuota.setCreadoPor(residente);
                Pagos cuotaGuardada = pagosRepo.save(cuota);

                // Crear detalle para que aparezca en el resumen
                Pago_Detalle detalle = new Pago_Detalle();
                detalle.setPago(cuotaGuardada);
                detalle.setConcepto("Cuota mensual de mantenimiento");
                detalle.setDescripcion("Cuota mensual de mantenimiento");
                detalle.setMonto(new BigDecimal("550.00"));
                detalle.setServicioPagado(Pago_Detalle.ServicioPagado.CUOTA); // Usa el enum correcto
                detalle.setEstadoPago(Pago_Detalle.EstadoPago.PENDIENTE);

                pagoDetalleRepo.save(detalle); // Guarda el detalle

                // ✅ LOG para cada residente que reciba cuota
                System.out.println("➡️ Cuota creada para: " + residente.getNombre() + " (CUI: " + residente.getCui() + ")");

           }
        }
    }

    @Transactional
    public void aplicarCorteASuspendidos() {
        List<Usuario> residentes = usuarioRepo.findByRol(Usuario.Rol.RESIDENTE);
        for (Usuario residente : residentes) {
            int cuotasPendientes = pagosRepo.contarCuotasPendientesPorUsuario(residente.getCui());
            if (cuotasPendientes >= 2 && residente.isEstado()) {
                usuarioRepo.desactivarUsuario(residente.getCui());
                System.out.println("Servicio cortado a: " + residente.getNombre());
            }
        }
    }
}
