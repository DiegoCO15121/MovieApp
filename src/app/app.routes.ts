import { Routes } from '@angular/router';
import { TableMovies } from './pages/tableMovies/tableMovies';
import { FormMovie } from './pages/formMovie/formMovie';
import { Movies } from './pages/movies/movies';

export const routes: Routes = [
  {
    path: 'table-movies',
    component: TableMovies,
  },
  {
    path: 'add-movie',
    component: FormMovie,
  },
  {
    path: 'movies',
    component: Movies,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'movies',
  },
];
