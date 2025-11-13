import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie.interface';
import { MovieCard } from "../../components/movieCard/movieCard";

@Component({
  selector: 'app-movies',
  imports: [MovieCard],
  templateUrl: './movies.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Movies {
  private moviesServide = inject(MovieService);
  movies!: Movie[];

  constructor() {
    this.moviesServide.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
