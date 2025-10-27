import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';

function yearRangeValidator(min: number, maxProvider: () => number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') return null;
    const year = Number(control.value);
    if (!Number.isInteger(year)) return { yearInvalid: 'El año debe ser un número entero.' };
    const max = maxProvider();
    if (year < min || year > max) return { yearOutOfRange: { min, max } };
    return null;
  };
}

function ratingValidator(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') return null;
    const rating = Number(control.value);
    if (Number.isNaN(rating)) return { ratingInvalid: 'La calificación debe ser un número.' };
    if (rating < min || rating > max) return { ratingOutOfRange: { min, max } };
    return null;
  };
}

@Component({
  selector: 'app-form-movie',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formMovie.html',
  styles: `
    :host {
      display: block;
    }
  `
})
export class FormMovie { 
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  readonly maxImageSizeBytes = 5 * 1024 * 1024; // 5 MB
  genres = [
    'Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia ficción',
    'Animación', 'Documental', 'Romance', 'Aventura', 'Thriller'
  ];

  constructor(private fb: FormBuilder) {
    const currentYear = () => new Date().getFullYear();
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      genre: ['', [Validators.required]],
      year: ['', [Validators.required, yearRangeValidator(1888, currentYear)]], // 1888 primer film registrado en muchos listados
      rating: ['', [Validators.required, ratingValidator(0, 10)]],
      poster: [null] // pista: no validador estricto aquí, manejado por sel. de archivo
    });
  }

  get title() { return this.form.get('title'); }
  get genre() { return this.form.get('genre'); }
  get year() { return this.form.get('year'); }
  get rating() { return this.form.get('rating'); }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return this.clearImage();

    const file = input.files[0];
    this.handleFile(file);
  }

  onDropFile(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    const file = event.dataTransfer.files[0];
    if (file) this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private handleFile(file: File) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Formato de imagen no permitido. Use PNG, JPEG o WEBP.');
      return;
    }
    if (file.size > this.maxImageSizeBytes) {
      alert('El archivo excede el tamaño máximo permitido (5 MB).');
      return;
    }

    this.selectedFile = file;
    this.form.patchValue({ poster: file });

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.form.patchValue({ poster: null });
    const fileInput = document.getElementById('posterInput') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.form.value.title,
      genre: this.form.value.genre,
      year: Number(this.form.value.year),
      rating: Number(this.form.value.rating),
      // se puede enviar el File directamente con FormData, o convertir a base64 si el backend lo requiere
      posterFile: this.selectedFile
    };

    // Ejemplo: preparar FormData para envío por HTTP
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('genre', payload.genre);
    formData.append('year', String(payload.year));
    formData.append('rating', String(payload.rating));
    if (payload.posterFile) formData.append('poster', payload.posterFile, payload.posterFile.name);

    // Aquí se inyectaría un servicio para hacer la petición HTTP.
    // Por ahora, se muestra en consola como demostración.
    console.log('Payload (object):', payload);
    console.log('FormData keys:');
    for (const key of (formData as any).keys()) console.log(key, formData.get(key));

    alert('Formulario válido. Revisar consola para ver payload / formData.');
    // reset opcional:
    // this.form.reset();
    // this.clearImage();
  }
}
