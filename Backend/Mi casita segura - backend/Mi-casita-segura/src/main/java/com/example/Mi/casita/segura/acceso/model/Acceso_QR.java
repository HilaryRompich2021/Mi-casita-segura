package com.example.Mi.casita.segura.acceso.model;

import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.visitantes.model.Visitante;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Acceso_QR {

 //PK
 @Id
 //Permite que la base de datos genere el valor automáticamente
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

 @Column(nullable = false)
    private String codigoQR;

 @Column(nullable = false)
 private LocalDateTime fechaGeneracion;

 @Enumerated(EnumType.STRING)
 private String estado;

 private LocalDateTime fechaExpiracion; // RN03.4

 //Relacion uno a uno a visitante
 @OneToOne
 //Define la columna en la tabla acceso_qr que referencia a la tabla visitante (FK)
 @JoinColumn(name = "visitante_id", referencedColumnName = "id")
 private Visitante visitante;

 @ManyToOne
 @JoinColumn(name = "asociado_a", referencedColumnName = "cui")
 private Usuario asociado;

 public enum estado {
  ACTIVO, USADO, EXPIRADO, INACTIVO

 }
}
