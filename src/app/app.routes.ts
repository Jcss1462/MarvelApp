import { Routes } from '@angular/router';
import { HeaderComponent } from './domains/shared/components/header/header.component'
import { ComicListComponent } from './domains/coimics/comic-list/comic-list.component';
import { RegisterComponent } from './domains/user/register/register.component';
import { LoginComponent } from './domains/user/login/login.component';
import { ForgotPasswordComponent } from './domains/user/forgot-password/forgot-password.component';

export const routes: Routes = [


    {
        path: "",
        component: HeaderComponent,
        children: [
            {
                path: "",
                component: ComicListComponent
            }
            ,{
                path: "signin",
                component: RegisterComponent
            }
            ,{
                path: "login",
                component: LoginComponent
            }
            ,{
                path: "forgotPassword",
                component: ForgotPasswordComponent
            }


            
        ]
    }


];
