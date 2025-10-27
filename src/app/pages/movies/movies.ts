import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movies',
  imports: [],
  templateUrl: './movies.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Movies { }
