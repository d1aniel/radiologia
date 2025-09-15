import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

import { TecnologoI } from '../../../models/technologists';
import { TecnologosService } from '../../../services/technologist';

@Component({
  selector: 'app-get-all-tecnologos',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule],
  templateUrl: './showtechnologists.html'
})
export class Showtechnologists {
  tecnologos: TecnologoI[] = [];

  constructor(private tecnologosService: TecnologosService) {
    this.tecnologosService.tecnologos$.subscribe(list => (this.tecnologos = list));
  }

  onDelete(id: number) {
    this.tecnologosService.deleteTecnologo(id);
  }
}
