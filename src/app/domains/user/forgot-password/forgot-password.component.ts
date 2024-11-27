import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../shared/services/spinner.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  private spinnerService = inject(SpinnerService);
  private userService = inject(UserService);

  constructor(private fb: FormBuilder, private location: Location, private toastr: ToastrService) {
    // Inicialización del formulario reactivo
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo obligatorio y formato de email
    });
  }

  // Función para manejar el envío del formulario
  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.spinnerService.showSpinner.update(() => true);
      this.userService.resetPassword(email)
        .then((response) => {
          console.log(response);
          this.toastr.success("Correo enviado a: "+email);
          this.spinnerService.showSpinner.update(() => false);
        }
        ).catch((response) => {
          console.log(response);
          this.toastr.info("Error al enviar correo de restablecimiento de contraseña: \n" + response.message);
          this.spinnerService.showSpinner.update(() => false);
        }
        );

      // Aquí podrías llamar a un servicio para enviar el enlace de recuperación
    } else {
      console.log('Formulario inválido');
      this.toastr.info("Formulario inválid");
      this.forgotPasswordForm.markAllAsTouched(); // Marca todos los campos para que se muestren los mensajes de error
    }
  }

  // Función para regresar a la página anterior
  goBack() {
    this.location.back(); // Regresa a la vista anterior en el historial del navegador
  }

}
