import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

import { MedicoI } from '../../../models/doctors';
import { MedicosService } from '../../../services/doctor';

@Component({
  selector: 'app-get-all-medicos',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule],
  templateUrl: './showdoctors.html'
})
export class Showdoctors {
  medicos: MedicoI[] = [];

  constructor(private medicosService: MedicosService) {
    this.medicosService.medicos$.subscribe(list => (this.medicos = list));
  }

  onDelete(id: number) {
    this.medicosService.deleteMedico(id);
  }
}
