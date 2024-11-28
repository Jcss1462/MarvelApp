import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewUser } from '../../shared/Models/user';
import { SpinnerService } from '../../shared/services/spinner.service';
import { UserService } from '../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HealthCheckService } from '../../shared/services/health-check.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  private spinnerService = inject(SpinnerService);
  private userService = inject(UserService);
  private healtCheckService = inject(HealthCheckService);

  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router, private location: Location) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      cc: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {


    if (this.registerForm.valid) {
      console.log('Formulario enviado:', this.registerForm.value);

      let newUser: NewUser = {
        cc: this.registerForm.get("cc")?.value,
        name: this.registerForm.get("name")?.value,
        password: this.registerForm.get("password")?.value,
        email: this.registerForm.get("email")?.value
      }

      this.spinnerService.showSpinner.update(() => true);

      //verifico que el backend este encendido
      this.healtCheckService.checkMarvelAppBackHealth().subscribe(
        {
          next: (healthResponse) => {

            //registro el usuario en firebase
            this.userService.register(newUser)
              .then((response) => {

                //obtengo el uid del usuario
                newUser.password = response.user.uid;

                //registro el usuario en el backend
                this.userService.registerBackend(newUser).subscribe({
                  next: (response)=>{
                    this.toastr.success("Usuario creado con exito");
                    this.registerForm.reset();
                    this.spinnerService.showSpinner.update(() => false);
                    //redirijo al login
                    this.router.navigate(['/login']);
                  },
                  error: (err)=>{
                    console.log(err);
                    this.toastr.info("Error al crear usuario en el backend: (Habla con el administrador) \n");
                    this.spinnerService.showSpinner.update(() => false);
                  }

                });
              }
              ).catch((response) => {
                console.log(response);
                this.toastr.info("Error al crear usuario en firebase: \n" + response.message);
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
      console.log('Formulario inválido.');
    }
  }

  goBack() {
    this.location.back();
  }

}
