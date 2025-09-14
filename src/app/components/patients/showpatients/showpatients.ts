import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { PacientsI } from '../../../models/pacients';
import { PatientsService } from '../../../services/patient';

@Component({
  selector: 'app-get-all-patients',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule],
  templateUrl: './showpatients.html'
})
export class Showpatients {
  pacients: PacientsI[] = [];

  constructor(private patientsService: PatientsService) {
    this.patientsService.patients$.subscribe(list => {
      this.pacients = list;
    });
  }
  
}
