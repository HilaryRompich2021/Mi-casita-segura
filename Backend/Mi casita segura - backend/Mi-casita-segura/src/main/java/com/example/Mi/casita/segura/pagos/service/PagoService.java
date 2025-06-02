package com.example.Mi.casita.segura.pagos.service;

import com.example.Mi.casita.segura.pagos.dto.PagoConsultaDTO;
import com.example.Mi.casita.segura.pagos.dto.PagoDetalleConsultaDTO;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagosRepository pagosRepo;
    private final UsuarioRepository usuarioRepo;
    private final ReservaRepository reservaRepo;
    private final ReinstalacionRepository reinstalacionRepo;
    private final PagoDetalleRepository pagoDetalleRepo;

    public Pagos registrarPago(PagoRequestDTO dto) {
        Usuario usuario = usuarioRepo.findById(dto.getCreadoPor())
                .orElseThrow(() -> new IllegalArgumentException("Usuario creador no encontrado"));

        List<Pagos> cuotasPendientes = pagosRepo.findByCreadoPor_CuiAndEstado(dto.getCreadoPor(), Pagos.EstadoDelPago.PENDIENTE);
        int cuotasPendientesPrevias = cuotasPendientes.size();

        Pagos pago = new Pagos();
        pago.setMontoTotal(dto.getMontoTotal());
        pago.setFechaPago(LocalDate.now());
        pago.setMetodoPago(dto.getMetodoPago());
        pago.setEstado(dto.getEstado());
        pago.setCreadoPor(usuario);

        validarTarjeta(dto);


        // Crear y asociar detalles
        List<Pago_Detalle> detalles = new ArrayList<>();
        BigDecimal montoTotal = BigDecimal.ZERO;
        //int cuotasPendientesPagadas = 0;

        for (PagoDetalleDTO detDTO : dto.getDetalles()) {

            Pago_Detalle detalle = new Pago_Detalle();
            detalle.setConcepto(detDTO.getConcepto());
            detalle.setDescripcion(detDTO.getDescripcion());
            detalle.setMonto(detDTO.getMonto());
            detalle.setServicioPagado(detDTO.getServicioPagado());
            detalle.setEstadoPago(detDTO.getEstadoPago());

            detalle.setPago(pago);

            System.out.println("ReservaId recibido: " + detDTO.getReservaId());

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
            montoTotal = montoTotal.add(detalle.getMonto());
            detalles.add(detalle);
        }

        //  Agregar cargo por reinstalación si cancela 2 o más cuotas pendientes
        if (cuotasPendientesPrevias >= 2) {
            ReinstalacionServicio reinstalacion = new ReinstalacionServicio();
            reinstalacion.setUsuario(usuario);
            reinstalacion.setFecha_solicitud(LocalDate.now());
            reinstalacion.setEstado("PENDIENTE");
            reinstalacion.setMonto(new BigDecimal("89.00"));

            reinstalacion = reinstalacionRepo.save(reinstalacion);


            Pago_Detalle cargoReinstalacion = new Pago_Detalle();
            cargoReinstalacion.setConcepto("Reinstalación de servicio");
            cargoReinstalacion.setDescripcion("Cargo adicional por 2 meses o más en atraso");
            cargoReinstalacion.setMonto(new BigDecimal("89.00"));
            cargoReinstalacion.setServicioPagado(Pago_Detalle.ServicioPagado.REINSTALACION);
            cargoReinstalacion.setEstadoPago(Pago_Detalle.EstadoPago.COMPLETADO);
            cargoReinstalacion.setPago(pago);
            cargoReinstalacion.setReinstalacion(reinstalacion);

            montoTotal = montoTotal.add(cargoReinstalacion.getMonto());
            detalles.add(cargoReinstalacion);


            // Actualizar monto total
            //pago.setMontoTotal(pago.getMontoTotal().add(new BigDecimal("89.00")));
        }
        pago.setMontoTotal(montoTotal);
        pago.setDetalles(detalles);

        //return pagosRepo.save(pago);
        Pagos pagoGuardado = pagosRepo.save(pago);

        // Actualizar todas las cuotas pendientes a COMPLETADO
        for (Pagos cuota : cuotasPendientes) {
            cuota.setEstado(Pagos.EstadoDelPago.COMPLETADO);
            pagosRepo.save(cuota); // Puedes optimizar con saveAll si prefieres

        }

        for (PagoDetalleDTO detDTO : dto.getDetalles()) {
            if (detDTO.getReservaId() != null) {
                // Buscamos el Pago_Detalle pendiente para esa reserva:
                Optional<Pago_Detalle> optDetallePendiente =
                        pagoDetalleRepo.findFirstByReserva_IdAndEstadoPago(
                                detDTO.getReservaId(),
                                Pago_Detalle.EstadoPago.PENDIENTE
                        );

                // Desempaquetamos el Optional. Si no existe, detallePendiente será null.
                Pago_Detalle detallePendiente = optDetallePendiente.orElse(null);

                if (detallePendiente != null) {
                    detallePendiente.setEstadoPago(Pago_Detalle.EstadoPago.COMPLETADO);
                    pagoDetalleRepo.save(detallePendiente);
                }
            }
        }


        // Confirmar las reservas si el pago fue exitoso
        for (PagoDetalleDTO detDTO : dto.getDetalles()) {
            if (detDTO.getReservaId() != null) {
                Reserva reserva = reservaRepo.findById(detDTO.getReservaId())
                        .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada para actualización de estado"));
                reserva.setEstado(Reserva.EstadoReserva.RESERVADO);
                reservaRepo.save(reserva);
            }
        }

        return pagoGuardado;
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

    public List<PagoConsultaDTO> obtenerPagosPorCui(String cui) {
        List<Pagos> pagos = pagosRepo.findByCreadoPorCui(cui);

        return pagos.stream().map(pago -> {
            PagoConsultaDTO dto = new PagoConsultaDTO();
            dto.setId(pago.getId());
            dto.setMontoTotal(pago.getMontoTotal());
            dto.setMetodoPago(pago.getMetodoPago());
            dto.setEstado(pago.getEstado());
            dto.setFechaPago(pago.getFechaPago());

            // Mapear detalles
            List<PagoDetalleConsultaDTO> detalleDTOs = pago.getDetalles().stream().map(detalle -> {
                PagoDetalleConsultaDTO detalleDTO = new PagoDetalleConsultaDTO();
                detalleDTO.setConcepto(detalle.getConcepto());
                detalleDTO.setDescripcion(detalle.getDescripcion());
                detalleDTO.setMonto(detalle.getMonto());
                detalleDTO.setServicioPagado(detalle.getServicioPagado());
                detalleDTO.setEstadoPago(detalle.getEstadoPago());

                // si este Pago_Detalle tiene reserva asociada, setea el id:
                if (detalle.getReserva() != null) {

                    detalleDTO.setReservaId(detalle.getReserva().getId());
                }

                return detalleDTO;


            }).collect(Collectors.toList());

            dto.setDetalles(detalleDTOs);

            return dto;
        }).collect(Collectors.toList());
    }


}
