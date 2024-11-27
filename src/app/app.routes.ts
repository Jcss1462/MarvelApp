import { Routes } from '@angular/router';
import { HeaderComponent } from './domains/shared/components/header/header.component'
import { ComicListComponent } from './domains/coimics/comic-list/comic-list.component';

export const routes: Routes = [


    {
        path: "",
        component: HeaderComponent,
        children: [
            {
                path: "",
                component: ComicListComponent
            },
            
        ]
    }


];
