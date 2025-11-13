import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [],
  template: `<div class="card shadow rounded">
    <img class="card-img-top" src="{{ movie.poster_url }}" alt="Title" />
    <div class="card-body">
      <h4 class="card-title">{{ movie.title }}</h4>
    </div>
  </div>`,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCard {
  @Input({ required: true })
  movie!: Movie;
}
