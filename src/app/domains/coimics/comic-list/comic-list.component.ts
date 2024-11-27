import { Component, inject, signal } from '@angular/core';
import { Comic } from '../../shared/Models/comic';
import { ComicService } from '../../shared/services/comic.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comic-list',
  imports: [],
  templateUrl: './comic-list.component.html',
  styleUrl: './comic-list.component.css'
})
export class ComicListComponent {

  comics = signal<Comic[]>([]);

  private  comicService= inject(ComicService);
  private spinnerService = inject(SpinnerService);

  constructor(private toastr: ToastrService,private router: Router){}

  ngOnInit(): void {
    this.getComicList();
  }

  private getComicList() {
    this.spinnerService.showSpinner.update(() => true);
    this.comicService.getComicsList()
    .subscribe({
      next: (comicWrapper) => {    
        this.comics.set(comicWrapper.data.results);
        console.log( this.comics());
        this.spinnerService.showSpinner.update(() => false);
      },
      error: () => {
        this.toastr.error("Error al intentar obtener la lista de comics");
        this.spinnerService.showSpinner.update(() => false);
      }
    })
  }

}
