// src/app/features/teams/createteam.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

import { TeamsService } from '../../../services/team';
import { EstadoTeam } from '../../../models/teams';

@Component({
  selector: 'app-createteam',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, SelectModule, ButtonModule, TextareaModule
  ],
  templateUrl: './createteams.html',
  styleUrls: ['./createteams.css']
})
export class Createteams {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private teamsService = inject(TeamsService);

  // Catálogos simples como strings (igual que Studies)
  modalidades = ['RX', 'TAC', 'RM'];

  estados: { label: string; value: EstadoTeam }[] = [
    { label: 'Disponible', value: 'DISPONIBLE' },
    { label: 'Mantenimiento', value: 'MANTENIMIENTO' },
    { label: 'Ocupado', value: 'OCUPADO' }
  ];

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    modalidad: ['', Validators.required],
    ubicacion: ['', [Validators.required, Validators.minLength(2)]],
    estado: ['DISPONIBLE' as EstadoTeam, Validators.required],
    observaciones: ['']
  });

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    this.teamsService.add({
      nombre: v.nombre!,
      modalidad: v.modalidad!,
      ubicacion: v.ubicacion!,
      estado: v.estado!,
      observaciones: v.observaciones ?? ''
    });

    this.router.navigate(['/teams/show']);
  }

  onCancel() {
    this.router.navigate(['/teams/show']);
  }
}
