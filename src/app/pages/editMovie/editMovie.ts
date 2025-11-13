import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie.interface';
import Swal from 'sweetalert2';

function yearRangeValidator(min: number, maxProvider: () => number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') return null;
    const year = Number(control.value);
    if (!Number.isInteger(year)) return { yearInvalid: true };
    const max = maxProvider();
    if (year < min || year > max) return { yearOutOfRange: { min, max } };
    return null;
  };
}

function ratingValidator(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') return null;
    const rating = Number(control.value);
    if (Number.isNaN(rating)) return { ratingInvalid: true };
    if (rating < min || rating > max) return { ratingOutOfRange: { min, max } };
    return null;
  };
}

@Component({
  selector: 'app-edit-movie',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editMovie.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class EditMovie {
  form: FormGroup;
  imagePreview: string | null = null;
  movieId!: number;

  private router = inject(Router);
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  genres = [
    'Acción',
    'Comedia',
    'Drama',
    'Terror',
    'Ciencia ficción',
    'Animación',
    'Documental',
    'Romance',
    'Aventura',
    'Thriller',
  ];

  constructor(private fb: FormBuilder) {
    const currentYear = () => new Date().getFullYear();

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      sinopsis: ['', [Validators.required, Validators.maxLength(500)]],
      genre: ['', [Validators.required]],
      year: ['', [Validators.required, yearRangeValidator(1888, currentYear)]],
      rating: ['', [Validators.required, ratingValidator(0, 10)]],
      poster: [''],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('movieId'));
    this.movieId = id;
    if (id) this.loadMovie(id);
  }

  loadMovie(id: number) {
    this.movieService.getMovie(id).subscribe({
      next: (movie) => {
        this.form.patchValue({
          title: movie.title,
          sinopsis: movie.sinopsis,
          genre: movie.genre,
          year: movie.releaseYear,
          rating: movie.raiting,
          poster: movie.poster_url,
        });
        this.imagePreview = movie.poster_url;
      },
      error: (err) => {
        console.error('Error al cargar la película:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la película.',
          icon: 'error',
        });
      },
    });
  }

  get title() {
    return this.form.get('title');
  }
  get sinopsis() {
    return this.form.get('sinopsis');
  }
  get genre() {
    return this.form.get('genre');
  }
  get year() {
    return this.form.get('year');
  }
  get rating() {
    return this.form.get('rating');
  }
  get poster() {
    return this.form.get('poster');
  }

  updatePreview() {
    const url = this.poster?.value;
    this.imagePreview = url;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Movie = {
      title: this.form.value.title,
      sinopsis: this.form.value.sinopsis,
      genre: this.form.value.genre,
      releaseYear: Number(this.form.value.year),
      raiting: Number(this.form.value.rating),
      poster_url: this.form.value.poster,
    };

    this.movieService.updateMovie(this.movieId, payload).subscribe({
      next: (pelicula) => {
      
        this.router.navigate(['/table-movies']);
        Swal.fire({
          title: 'Película actualizada correctamente',
          text: `La película fue actualizida correctamente.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Error al actualizar la película:', error);
      },
    });
  }
}
