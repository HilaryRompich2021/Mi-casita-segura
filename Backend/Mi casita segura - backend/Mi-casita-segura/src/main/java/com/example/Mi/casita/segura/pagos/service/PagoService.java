package com.example.Mi.casita.segura.pagos.service;

import com.example.Mi.casita.segura.pagos.dto.PagoDetalleDTO;
import com.example.Mi.casita.segura.pagos.dto.PagoRequestDTO;
import com.example.Mi.casita.segura.pagos.model.Pago_Detalle;
import com.example.Mi.casita.segura.pagos.model.Pagos;
import com.example.Mi.casita.segura.pagos.repository.PagoDetalleRepository;
import com.example.Mi.casita.segura.pagos.repository.PagosRepository;
import com.example.Mi.casita.segura.reinstalacion.model.ReinstalacionServicio;
import com.example.Mi.casita.segura.reservas.model.Reserva;
import com.example.Mi.casita.segura.reservas.repository.ReservaRepository;
import com.example.Mi.casita.segura.soporte.repository.ReinstalacionRepository;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagosRepository pagosRepo;
    private final PagoDetalleRepository detalleRepo;
    private final UsuarioRepository usuarioRepo;
    private final ReservaRepository reservaRepo;
    private final ReinstalacionRepository reinstalacionRepo;

    public Pagos registrarPago(PagoRequestDTO dto) {
        Usuario usuario = usuarioRepo.findById(dto.getCreadoPor())
                .orElseThrow(() -> new IllegalArgumentException("Usuario creador no encontrado"));

        Pagos pago = new Pagos();
        pago.setMontoTotal(dto.getMontoTotal());
        pago.setFechaPago(LocalDate.now());
        pago.setMetodoPago(dto.getMetodoPago());
        pago.setEstado(dto.getEstado());
        pago.setCreadoPor(usuario);

        // Crear y asociar detalles
        List<Pago_Detalle> detalles = new ArrayList<>();
        for (PagoDetalleDTO detDTO : dto.getDetalles()) {
            Pago_Detalle detalle = new Pago_Detalle();
            detalle.setConcepto(detDTO.getConcepto());
            detalle.setDescripcion(detDTO.getDescripcion());
            detalle.setMonto(detDTO.getMonto());
            detalle.setServicioPagado(detDTO.getServicioPagado());
            detalle.setEstadoPago(detDTO.getEstadoPago());
            pago.setEstado(Pagos.EstadoDelPago.COMPLETADO);

            //detalle.setEstadoPago(detDTO.getEstadoPago());
            detalle.setPago(pago);

            if (detDTO.getReservaId() != null) {
                Reserva reserva = reservaRepo.findById(detDTO.getReservaId())
                        .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
                detalle.setReserva(reserva);
            }

            if (detDTO.getReinstalacionId() != null) {
                ReinstalacionServicio reinstalacion = reinstalacionRepo.findById(detDTO.getReinstalacionId())
                        .orElseThrow(() -> new IllegalArgumentException("Reinstalación no encontrada"));
                detalle.setReinstalacion(reinstalacion);
            }

            if (detDTO.getServicioPagado() == Pago_Detalle.ServicioPagado.AGUA) {
                double usados = detDTO.getMetrosCubicosUsados() != null ? detDTO.getMetrosCubicosUsados() : 0.0;
                double excedente = usados > 4.0 ? usados - 4.0 : 0.0;
                BigDecimal montoExceso = BigDecimal.valueOf(excedente * 23.50);
                BigDecimal cuotaBase = new BigDecimal("550.00");

                // Si hay excedente, sumar ambos
                detalle.setMonto(cuotaBase.add(montoExceso));
                detalle.setDescripcion("Consumo de agua mensual: " + usados + " m³, Excedente: " + excedente + " m³");
            } else {
                detalle.setMonto(detDTO.getMonto()); // para los otros servicios
            }


            detalles.add(detalle);
        }

        pago.setPago_Detalle(detalles);

        return pagosRepo.save(pago);
    }



    private void validarTarjeta(PagoRequestDTO dto) {
        if (!dto.getMetodoPago().equalsIgnoreCase("TARJETA")) return;

        if (!dto.getNumeroTarjeta().matches("\\d{16}"))
            throw new IllegalArgumentException("El número de tarjeta debe tener 16 dígitos");

        if (!dto.getCvv().matches("\\d{3,4}"))
            throw new IllegalArgumentException("El CVV debe tener 3 o 4 dígitos");

        if (!dto.getFechaVencimiento().matches("^(0[1-9]|1[0-2])/\\d{2}$"))
            throw new IllegalArgumentException("La fecha de vencimiento debe tener formato MM/YY");
    }

    public List<Pagos> obtenerPagosPorUsuario(String cui) {
        List<Pagos> pagos = pagosRepo.findByCreadoPorCui(cui);

        LocalDate hoy = LocalDate.now();
        LocalDate fechaCorte = LocalDate.of(hoy.getYear(), hoy.getMonth(), 21);

        // Verifica si hay algún pago COMPLETADO en el mes actual
        boolean cuotaPagada = pagos.stream()
                .anyMatch(p -> p.getFechaPago().getMonth() == hoy.getMonth()
                        && p.getEstado() == Pagos.EstadoDelPago.COMPLETADO);

        // Si no hay, crea una cuota pendiente
        if (!cuotaPagada && hoy.isAfter(fechaCorte)) {
            Pagos cuotaPendiente = new Pagos();
            cuotaPendiente.setMontoTotal(BigDecimal.valueOf(550));
            cuotaPendiente.setFechaPago(fechaCorte);
            cuotaPendiente.setEstado(Pagos.EstadoDelPago.PENDIENTE);
            Usuario usuario = usuarioRepo.findById(cui).orElse(null);
            cuotaPendiente.setCreadoPor(usuario);
            pagos.add(cuotaPendiente);
        }

        return pagos;
    }


}
