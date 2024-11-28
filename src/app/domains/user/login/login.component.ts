import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../shared/services/spinner.service';
import { UserService } from '../../shared/services/user.service';
import { LogInUser } from '../../shared/Models/user';
import { Location } from '@angular/common';
import { HealthCheckService } from '../../shared/services/health-check.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  private spinnerService = inject(SpinnerService);
  private userService = inject(UserService);
  private healtCheckService = inject(HealthCheckService);

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private location: Location) {
    // Inicialización del formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo obligatorio y formato de email
      password: ['', [Validators.required, Validators.minLength(6)]] // Campo obligatorio y mínimo 6 caracteres
    });
  }


  // Función para manejar el envío del formulario
  onSubmit() {
    if (this.loginForm.valid) {

      let user: LogInUser = {
        uid: this.loginForm.get("password")?.value,
        email: this.loginForm.get("email")?.value
      }

      this.spinnerService.showSpinner.update(() => true);
      //verifico que el backend este encendido
      this.healtCheckService.checkMarvelAppBackHealth().subscribe(
        {
          next: (healthResponse) => {

            //iinicio sesion en firebase
            this.userService.login(user)
              .then((response) => {
                console.log(response);

                //obtengo el uid del usiario
                user.uid = response.user.uid;

                //obtengo la informacion del usuario
                this.userService.loginBackend(user).subscribe(
                  {
                    next: (response) => {

                      //elimino la informacion del local storage
                      localStorage.removeItem('MarevelAppUserData');         
                      //guardo la informacion en el localstorage
                      const userData = JSON.stringify(response);
                      localStorage.setItem('MarevelAppUserData', userData);
                      this.toastr.success("Bienvenido "+response.nombre);
                      //redirijo a la pagina principal
                      this.router.navigate(['/']);
                      
                      this.spinnerService.showSpinner.update(() => false);

                    },
                    error: (err) => {
                      console.log(err);
                      this.toastr.info("Error al obtener informacion del usuario: (Habla con el administrador) \n");
                      this.spinnerService.showSpinner.update(() => false);
                    }
                });

              }
              ).catch((response) => {
                console.log(response);
                this.toastr.info("Error al iniciar sesión: \n" + response.message);
                this.spinnerService.showSpinner.update(() => false);
              }
              );

          },
          error: (err) => {
            this.toastr.info("EL backend de la aplicacion no se encuentra disponible");
            console.log(err);
            this.spinnerService.showSpinner.update(() => false);
          }
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
