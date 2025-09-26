import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';


@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
  form: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      user: ['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { user, pass } = this.form.value;

    if (this.auth.login(user!, pass!)) {
      // Cambia '/admin' por tu dashboard real si ya lo tienes
      this.router.navigateByUrl('/admin');
    } else {
      this.error = 'Usuario o contraseña inválidos';
    }
  }
}
