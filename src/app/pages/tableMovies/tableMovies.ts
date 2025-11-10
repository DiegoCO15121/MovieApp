import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { __classPrivateFieldGet } from 'tslib';
import { Movie } from '../../interfaces/movie.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-movies',
  imports: [],
  templateUrl: './tableMovies.html',
  styles: `
    :host {
      display: block;
    }
  `,
  /* hangeDetection: ChangeDetectionStrategy.OnPush, */
})
export class TableMovies {
  movies: Movie[] = [];
  private router = inject(Router);
  private movieService = inject(MovieService);

  agregarPelicula() {
    this.router.navigate(['add-movie']);
   
  }

  constructor() {
    this.getMovies();
  }
  getMovies() {
    this.movieService.getMovies().subscribe({
      next: (pelis) => {
        console.log(pelis);
        this.movies = pelis;
        console.log(this.movies);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  onDeleteMovie(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la película de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.movieService.deleteMovie(id).subscribe({
          next: () => {
            this.movies = this.movies.filter((movie) => movie.id !== id);
            Swal.fire({
              title: 'Eliminada',
              text: `La película fue eliminada correctamente.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la película. Inténtalo nuevamente.',
              icon: 'error',
            });
            console.error(err);
          },
        });
      }
    });
  }
}
