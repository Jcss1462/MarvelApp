import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewUser } from '../../shared/Models/user';
import { SpinnerService } from '../../shared/services/spinner.service';
import { UserService } from '../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private toastr: ToastrService,private router: Router) {
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
      this.userService.register(newUser)
        .then((response) => {
            console.log(response);
            this.toastr.success("Usuario creado con exito");
            this.registerForm.reset();
            this.spinnerService.showSpinner.update(() => false);
          }
        ).catch((response) => {
          console.log(response);
          this.toastr.error("Error al crear usuario: \n" +response.message);
          this.spinnerService.showSpinner.update(() => false);
        }
      );


    } else {
      console.log('Formulario inválido.');
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

}
