import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie.interface';

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
  selector: 'app-form-movie',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formMovie.html',
  styles: [`:host { display: block; }`]
})
export class FormMovie {
  form: FormGroup;
  imagePreview: string | null = null;

  private router = inject(Router);
  private movieService = inject(MovieService);

  genres = [
    'Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia ficción',
    'Animación', 'Documental', 'Romance', 'Aventura', 'Thriller'
  ];

  constructor(private fb: FormBuilder) {
    const currentYear = () => new Date().getFullYear();

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      sinopsis: ['', [Validators.required, Validators.maxLength(500)]],
      genre: ['', [Validators.required]],
      year: ['', [Validators.required, yearRangeValidator(1888, currentYear)]],
      rating: ['', [Validators.required, ratingValidator(0, 10)]],
      poster: [
        ''
      ]
    });
  }

  // Getters convenientes
  get title() { return this.form.get('title'); }
  get sinopsis() { return this.form.get('sinopsis'); }
  get genre() { return this.form.get('genre'); }
  get year() { return this.form.get('year'); }
  get rating() { return this.form.get('rating'); }
  get poster() { return this.form.get('poster'); }

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
      poster_url: this.form.value.poster
    };

    console.log('Datos listos para enviar:', payload);

    this.movieService.postMovie(payload).subscribe({
      next: (pelicula) => {
        console.log('Película creada:', pelicula);
        this.router.navigate(['/table-movies']);
      },
      error: (error) => {
        console.error('Error al crear la película:', error);
      }
    });
  }
}
