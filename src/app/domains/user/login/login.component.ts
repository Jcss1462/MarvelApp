import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../shared/services/spinner.service';
import { UserService } from '../../shared/services/user.service';
import { logInUser } from '../../shared/Models/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLinkWithHref],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  private spinnerService = inject(SpinnerService);
  private userService = inject(UserService);

  constructor(private fb: FormBuilder, private router: Router,private toastr: ToastrService, private location: Location) {
    // Inicialización del formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo obligatorio y formato de email
      password: ['', [Validators.required, Validators.minLength(6)]] // Campo obligatorio y mínimo 6 caracteres
    });
  }


   // Función para manejar el envío del formulario
   onSubmit() {
    if (this.loginForm.valid) {

      let user: logInUser = {
        password: this.loginForm.get("password")?.value,
        email: this.loginForm.get("email")?.value
      }
      
      this.spinnerService.showSpinner.update(() => true);
      this.userService.login(user)
        .then((response) => {
            console.log(response);
            this.spinnerService.showSpinner.update(() => false);
          }
        ).catch((response) => {
          console.log(response);
          this.toastr.info("Error al iniciar sesión: \n" +response.message);
          this.spinnerService.showSpinner.update(() => false);
        }
      );
     
    } else {
      this.toastr.error("Usuario o contraseña incorrectos");
    }
  }

  goBack() {
    this.location.back();
  }

}
