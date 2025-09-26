import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

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

  enviarFormulario(form: NgForm) { 
    if (form.invalid) return;
    console.log('Formulario enviado:', this.soporte);
    alert(`Gracias, ${this.soporte.nombre}. Tu solicitud fue enviada. 📩`);
    form.resetForm(); // limpia el form
  }
}
