package com.example.Mi.casita.segura.pagos.service;

import com.example.Mi.casita.segura.pagos.model.Pagos;
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

    @Scheduled(cron = "0 0 0 20 * ?") // Cada 27 del mes
    public void generarCuotasMensuales() {
        List<Usuario> residentes = usuarioRepo.findByRol(Usuario.Rol.RESIDENTE);

        for (Usuario residente : residentes) {
            LocalDate hoy = LocalDate.now();
            boolean yaTiene = pagosRepo.existsByCreadoPorAndMesAndAnio(
                    residente.getCui(), hoy.getMonthValue(), hoy.getYear());

            if (!yaTiene) {
                Pagos cuota = new Pagos();
                cuota.setMontoTotal(new BigDecimal("550.00"));
                cuota.setFechaPago(hoy); // fecha de emisión
                cuota.setEstado(Pagos.EstadoDelPago.PENDIENTE);
                cuota.setMetodoPago("EFECTIVO");
                cuota.setCreadoPor(residente);
                pagosRepo.save(cuota);
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
