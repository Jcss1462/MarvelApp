import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comic } from '../../shared/Models/comic';
import { ComicService } from '../../shared/services/comic.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { HealthCheckService } from '../../shared/services/health-check.service';
import { ComicFavorito } from '../../shared/Models/comicFavorito';

@Component({
  selector: 'app-comic-detail',
  imports: [],
  templateUrl: './comic-detail.component.html',
  styleUrl: './comic-detail.component.css'
})
export class ComicDetailComponent {

  comicId!: number;
  comic = signal<Comic | null>(null);

  private comicService = inject(ComicService);
  private spinnerService = inject(SpinnerService);
  private localStorageService = inject(LocalStorageService);
  private healtCheckService = inject(HealthCheckService);
  userData = this.localStorageService.userData;

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private location: Location) { }

  ngOnInit(): void {
    this.comicId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Comic ID:', this.comicId);
    // Ahora puedes usar el ID para cargar los datos correspondientes
    if (this.comicId != null) {
      this.getComicDataById(this.comicId);
    }
  }

  getComicDataById(id: number) {
    if (id != null) {
      this.spinnerService.showSpinner.update(() => true);
      this.comicService.getComicById(id).subscribe({
        next: (comicDatataWrapper) => {
          //obtengo el comic y lo añado al objeto
          let currentComic: Comic = comicDatataWrapper.data.results[0];
          this.comic.set(currentComic);
          //(si el usuario inicioo sesion)obtnego los comics favortos y los seteo visualmente
          if (this.userData() != null) {
            this.checkComicIsFavorite(this.userData()!.idUsuario);
          }
          this.spinnerService.showSpinner.update(() => false);
        },
        error: (err) => {
          console.log(err);
          this.toastr.info("Error al obtener comic por id: \n" + err);
          this.spinnerService.showSpinner.update(() => false);
        }
      });
    }
  }


  checkComicIsFavorite(idUsuario: number) {
    if (this.userData() != null) {

      const currentComic = this.comic();

      this.spinnerService.showSpinner.update(() => true);
      //verifico que el backend este encendido
      this.healtCheckService.checkMarvelAppBackHealth().subscribe(
        {
          next: (healthResponse) => {
            //registro el usuario en el backend
            this.comicService.getFavoriteComicsAsString(idUsuario).subscribe({
              next: (response) => {

                //seteo la propiedad favorito
                let arrIdComicFav = response.split(",");

                if (currentComic != null) {

                  if (arrIdComicFav.includes(this.comic()!.id.toString())) {

                    this.comic.set({
                      ...currentComic,  // Conservamos todas las propiedades actuales
                      favorite: true
                    });

                  } else {

                    this.comic.set({
                      ...currentComic,  // Conservamos todas las propiedades actuales
                      favorite: false
                    });

                  }
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
                this.checkComicIsFavorite(this.userData()!.idUsuario);
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


  goBack() {
    this.location.back();
  }

}
