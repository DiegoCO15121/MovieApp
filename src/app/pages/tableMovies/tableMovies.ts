import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { __classPrivateFieldGet } from 'tslib';

@Component({
  selector: 'app-table-movies',
  imports: [],
  templateUrl: './tableMovies.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableMovies {
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
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
