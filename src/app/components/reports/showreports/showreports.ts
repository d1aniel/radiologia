import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';

import { InformeI } from '../../../models/reports';
import { InformeService } from '../../../services/report';
import { StudiesService } from '../../../services/studie';

type Estudio = { id: number; paciente: string };

@Component({
  selector: 'app-show-informes',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, RouterModule],
  templateUrl: './showreports.html'
})
export class Showreports {
  filas: Array<
    InformeI & {
      estudioLabel: string;
      pacienteNombre: string;
      medicoNombre: string; // placeholder si aún no hay DoctorsService
    }
  > = [];

  constructor(
    private informeService: InformeService,
    private studiesService: StudiesService
  ) {
    this.informeService.informes$.subscribe(() => this.composeRows());
    this.composeRows();
  }

  private composeRows() {
    const informes = this.informeService.value;
    const estudios: Estudio[] = this.studiesService.getAll();

    const estudioById = new Map<number, Estudio>(estudios.map(e => [e.id, e]));

    this.filas = informes.map((inf) => {
      const est = estudioById.get(inf.estudioId);
      const estudioLabel = est ? `Estudio #${est.id}` : `Estudio ${inf.estudioId}`;
      const pacienteNombre = est?.paciente ?? '—';
      const medicoNombre = `Médico ${inf.medicoId}`; // ajusta cuando tengas DoctorsService
      return { ...inf, estudioLabel, pacienteNombre, medicoNombre };
    });
  }

  borrar(id: number) {
    this.informeService.deleteInforme(id);
    this.composeRows();
  }
}
