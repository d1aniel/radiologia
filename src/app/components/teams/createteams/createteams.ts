// src/app/features/teams/createteams.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../services/auth';
import { TeamService } from '../../../services/team';       // 👈 service HTTP
import { EstadoTeam, TeamI } from '../../../models/teams';

type Opt = { label: string; value: number | null };

@Component({
  selector: 'app-createteams',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    Select,
    ButtonModule,
    TextareaModule,
    ToastModule
  ],
  templateUrl: './createteams.html',
  styleUrls: ['./createteams.css'],
  providers: [MessageService]
})
export class Createteams implements OnInit {
  form!: FormGroup;
  loading = false;

  // Combo de modalidades (vendrán de /api/modalidades)
  modalities: Opt[] = [];

  estados: { label: string; value: EstadoTeam }[] = [
    { label: 'Disponible', value: 'DISPONIBLE' },
    { label: 'Mantenimiento', value: 'MANTENIMIENTO' },
    { label: 'Ocupado', value: 'OCUPADO' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private teamService: TeamService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      modality_id: [null, Validators.required],         // 👈 ya no "modalidad"
      ubicacion: ['', [Validators.required, Validators.minLength(2)]],
      estado: ['DISPONIBLE' as EstadoTeam, Validators.required],
      observaciones: ['']
    });

    this.loadModalities();
  }

  /** ====== Helpers ====== */
  private headers(): HttpHeaders {
    let h = new HttpHeaders();
    const t = this.auth.getToken?.();
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  private loadModalities(): void {
    this.http.get<any>('http://localhost:4000/api/modalidades', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.modalidades || []);
          this.modalities = (list || []).map((m: any) => ({
            label: `${m.nombre} - ${m.descripcion ?? ''}`,
            value: m.id
          }));
        },
        error: (err) => {
          console.error('Error cargando modalidades:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las modalidades'
          });
        }
      });
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) {
      this.markAllTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Revisa el formulario.'
      });
      return;
    }

    const v = this.form.value;
    const payload: Omit<TeamI, 'id'> = {
      nombre: v['nombre'],
      modality_id: v['modality_id'],
      ubicacion: v['ubicacion'],
      estado: v['estado'],
      observaciones: v['observaciones'] ?? ''
    };

    this.loading = true;
    this.teamService.createTeam(payload).subscribe({
      next: (team) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Equipo "${team.nombre}" creado correctamente`
        });
        setTimeout(() => this.router.navigate(['/teams/show']), 700);
      },
      error: (err) => {
        console.error('Error creating team:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.error || 'No se pudo crear el equipo'
        });
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/teams/show']);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c || !c.touched || !c.errors) return '';
    if (c.errors['required']) return 'Campo requerido';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres`;
    return 'Valor no válido';
  }

  private markAllTouched(): void {
    Object.values(this.form.controls).forEach(c => c.markAsTouched());
  }
}
