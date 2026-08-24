import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { MatCardModule } from "@angular/material/card";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormField, MatLabel, MatError, RouterLink, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  error = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

submit() {
  if (this.form.invalid) return;

  const { email, password } = this.form.value;

  this.auth.login(email!, password!).subscribe({
    next: () => this.router.navigate(['/products']),
    error: err => {
      let message = 'Errore durante il login';

      if (err.status === 401) {
        message = err.error?.error || 'Email o password non valide';
      } else if (err.status === 422) {
        message = err.error?.error || 'Dati non validi';
      } else if (err.status === 500) {
        message = 'Errore del server';
      }
      this.error = true;
      this.snackBar.open(message, 'Chiudi', { duration: 3000 });
    }
  });
}

    getControl(path: string) {
  return this.form.get(path);
  }

  hasError(path: string, errorCode: string): boolean {
  const control = this.getControl(path);
  return !!control && control.hasError(errorCode) && control.touched;
  }
}

