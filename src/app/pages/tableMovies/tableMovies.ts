import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { __classPrivateFieldGet } from 'tslib';
import { Movie } from '../../interfaces/movie.interface';


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
  movies: Movie[] = []
  private router = inject(Router);
  private movieService = inject(MovieService);

  agregarPelicula() {
    this.router.navigate(['add-movie']);
  }

  constructor(){
    this.getMovies()
  }
  getMovies() {
    this.movieService.getMovies().subscribe({
      next: (pelis) => {
        console.log(pelis);
        this.movies = pelis 
        console.log(this.movies)
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
