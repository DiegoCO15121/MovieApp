import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

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
  private router = inject(Router)
  agregarPelicula() {
    this.router.navigate(["add-movie"])
  }
 }
