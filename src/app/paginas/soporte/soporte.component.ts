import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.css'
})
export class SoporteComponent {
  soporte = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  };

  solicitudEnviada = false;
  numeroTicket = '';

  constructor(public router: Router) {}

  enviarFormulario(form: NgForm) { 
    if (form.invalid) {
      alert('Por favor, completa todos los campos obligatorios correctamente');
      return;
    }
    
    // Generar número de ticket
    this.numeroTicket = 'TKT-' + Date.now().toString().slice(-8);
    
    // Simular envío de solicitud
    console.log('Solicitud enviada:', this.soporte);
    this.solicitudEnviada = true;
    
    // Redirigir al home después de 5 segundos
    setTimeout(() => {
      this.router.navigateByUrl('/home');
    }, 5000);
  }
}
