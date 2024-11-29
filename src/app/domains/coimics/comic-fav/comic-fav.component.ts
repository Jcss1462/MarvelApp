import { Component, inject, signal } from '@angular/core';
import { ComicService } from '../../shared/services/comic.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { HealthCheckService } from '../../shared/services/health-check.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Comic } from '../../shared/Models/comic';
import { ComicFavorito } from '../../shared/Models/comicFavorito';

@Component({
  selector: 'app-comic-fav',
  imports: [],
  templateUrl: './comic-fav.component.html',
  styleUrl: './comic-fav.component.css'
})
export class ComicFavComponent {


  comics = signal<Comic[]>([]);

  private comicService = inject(ComicService);
  private spinnerService = inject(SpinnerService);
  private localStorageService = inject(LocalStorageService);
  private healtCheckService = inject(HealthCheckService);
  userData = this.localStorageService.userData;
  showSpinner=this.spinnerService.showSpinner;

  constructor(private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    if (this.userData() != null) {
      this.getFavoriteComicsList(this.userData()!.idUsuario);
    }
  }

  getFavoriteComicsList(id: number) {
    if (this.userData() != null) {
      //vacio la lista para recargarla
      this.comics.set([]);

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
                arrIdComicFav.forEach(element => {

                  if (element != "") {

                    this.spinnerService.showSpinner.update(() => true);

                    this.comicService.getComicById(parseInt(element)).subscribe({
                      next: (comicDatataWrapper) => {
                        //obtengo el comic y lo añado al objeto
                        let currentComic: Comic = comicDatataWrapper.data.results[0];
                        currentComic.favorite = true;
                        this.comics.update((currentItem) => [...currentItem, currentComic]);

                        this.spinnerService.showSpinner.update(() => false);
                      },
                      error: (err) => {
                        console.log(err);
                        this.toastr.info("Error al obtener comic por id: \n" + err);
                        this.spinnerService.showSpinner.update(() => false);
                      }

                    });

                  } else {
                    this.spinnerService.showSpinner.update(() => false);
                  }


                });

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
                this.getFavoriteComicsList(this.userData()!.idUsuario);
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

  goToComicDetaiil(comicId:number){
    this.router.navigate(['/comicDetail', comicId]);
  }
}
