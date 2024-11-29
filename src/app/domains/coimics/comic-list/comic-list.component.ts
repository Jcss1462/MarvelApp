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
  totalComics=signal<number>(0);
  currentPage=signal<number>(1);
  limit=signal<number>(24);

  private  comicService= inject(ComicService);
  private spinnerService = inject(SpinnerService);


  constructor(private toastr: ToastrService,private router: Router){}

  ngOnInit(): void {
    this.getComicList(this.currentPage(),this.limit());
  }

  private getComicList(pageNumber: number, limit:number) {
    this.spinnerService.showSpinner.update(() => true);
    this.comicService.getComicsList(pageNumber,limit)
    .subscribe({
      next: (comicWrapper) => {    
        this.comics.set(comicWrapper.data.results);
        this.totalComics.set(comicWrapper.data.total);
        console.log( this.comics());
        this.spinnerService.showSpinner.update(() => false);
      },
      error: () => {
        this.toastr.error("Error al intentar obtener la lista de comics");
        this.spinnerService.showSpinner.update(() => false);
      }
    })
  }


  

  nextPage() {
   this.currentPage.set(this.currentPage()+1);
   this.getComicList(this.currentPage(),this.limit());
  }

  prevPage() {
    this.currentPage.set(this.currentPage()-1);
    this.getComicList(this.currentPage(),this.limit());
  
  }


}
