import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from './domains/shared/services/spinner.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MarvelApp';

  constructor(private toastr: ToastrService){}

  private  spinnerService= inject(SpinnerService);
  showSpinner=this.spinnerService.showSpinner;

}
