import { Component, inject, signal } from '@angular/core';
import { Comic } from '../../shared/Models/comic';
import { ComicService } from '../../shared/services/comic.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLinkWithHref } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ComicFavorito } from '../../shared/Models/comicFavorito';
import { HealthCheckService } from '../../shared/services/health-check.service';

@Component({
  selector: 'app-comic-list',
  imports: [],
  templateUrl: './comic-list.component.html',
  styleUrl: './comic-list.component.css'
})
export class ComicListComponent {

  comics = signal<Comic[]>([]);
  totalComics = signal<number>(0);
  currentPage = signal<number>(1);
  limit = signal<number>(24);

  private comicService = inject(ComicService);
  private spinnerService = inject(SpinnerService);
  private localStorageService = inject(LocalStorageService);
  private healtCheckService = inject(HealthCheckService);
  userData = this.localStorageService.userData;


  constructor(private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.getComicList(this.currentPage(), this.limit());
  }

  private getComicList(pageNumber: number, limit: number) {
    this.spinnerService.showSpinner.update(() => true);
    this.comicService.getComicsList(pageNumber, limit)
      .subscribe({
        next: (comicWrapper) => {
          this.comics.set(comicWrapper.data.results);
          this.totalComics.set(comicWrapper.data.total);
          console.log(this.comics());
          //(si el usuario inicioo sesion)obtnego los comics favortos y los seteo visualmente
          if (this.userData() != null) {
            this.getFavoriteComics(this.userData()!.idUsuario);
          }
          this.spinnerService.showSpinner.update(() => false);
        },
        error: () => {
          this.toastr.error("Error al intentar obtener la lista de comics");
          this.spinnerService.showSpinner.update(() => false);
        }
      })
  }


  nextPage() {
    this.currentPage.set(this.currentPage() + 1);
    this.getComicList(this.currentPage(), this.limit());
  }

  prevPage() {
    this.currentPage.set(this.currentPage() - 1);
    this.getComicList(this.currentPage(), this.limit());
  }

  toogleFavorito(id: number) {

    let comicFavorito: ComicFavorito = {
      IdUsuario: this.userData()!.idUsuario,
      IdComic: id
    }

    this.spinnerService.showSpinner.update(() => true);

    //verifico que el backend este encendido
    this.healtCheckService.checkMarvelAppBackHealth().subscribe(
      {
        next: (healthResponse) => {
          //registro el usuario en el backend
          this.comicService.toogleFavorite(comicFavorito).subscribe({
            next: (response) => {
              this.spinnerService.showSpinner.update(() => false);
              //(si el usuario inicioo sesion)obtnego los comics favortos y los seteo visualmente
              if (this.userData() != null) {
                this.getFavoriteComics(this.userData()!.idUsuario);
              }
            },
            error: (err) => {
              console.log(err);
              this.toastr.info("Error al actualizar favorito: \n" + err);
              this.spinnerService.showSpinner.update(() => false);
            }
          });
        },
        error: (err) => {
          this.toastr.info("EL backend de la aplicacion no se encuentra disponible");
          console.log(err);
          this.spinnerService.showSpinner.update(() => false);
        }
      }
    );
  }



  getFavoriteComics(id: number) {
    if (this.userData() != null) {
      this.spinnerService.showSpinner.update(() => true);
      //verifico que el backend este encendido
      this.healtCheckService.checkMarvelAppBackHealth().subscribe(
        {
          next: (healthResponse) => {
            //registro el usuario en el backend
            this.comicService.getFavoriteComicsAsString(id).subscribe({
              next: (response) => {

                //seteo la propiedad favorito
                let arrIdComicFav = response.split(",");
                //si hay favoritos
                if (arrIdComicFav.length > 0) {

                  this.comics.update(
                    current => current.map(
                      item => arrIdComicFav.includes(item.id.toString()) ? { ...item, favorite: true } : { ...item, favorite: false }
                    )
                  );
                }

                this.spinnerService.showSpinner.update(() => false);
              },
              error: (err) => {
                console.log(err);
                this.toastr.info("Error al obtener el listado de comics favoritos: \n" + err);
                this.spinnerService.showSpinner.update(() => false);
              }
            });
          },
          error: (err) => {
            this.toastr.info("EL backend de la aplicacion no se encuentra disponible");
            console.log(err);
            this.spinnerService.showSpinner.update(() => false);
          }
        }
      );
    }

  }


  goToComicDetaiil(comicId:number){
    this.router.navigate(['/comicDetail', comicId]);
  }

}
