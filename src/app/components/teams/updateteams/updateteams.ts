// src/app/features/teams/editteams.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../services/auth';
import { TeamService } from '../../../services/team';
import { TeamI, EstadoTeam } from '../../../models/teams';

type Opt = { label: string; value: number | null };

@Component({
  selector: 'app-edit-teams',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    Select,
    TextareaModule,
    ToastModule
  ],
  templateUrl: './updateteams.html',
  styleUrls: ['./updateteams.css'],
  providers: [MessageService]
})
export class Updateteams implements OnInit {
  form!: FormGroup;
  loading = false;
  teamId!: number;

  // Combo de modalidades (como en createteams / createstudies)
  modalities: Opt[] = [];

  estados: { label: string; value: EstadoTeam }[] = [
    { label: 'Disponible', value: 'DISPONIBLE' },
    { label: 'Mantenimiento', value: 'MANTENIMIENTO' },
    { label: 'Ocupado', value: 'OCUPADO' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private teamService: TeamService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      modality_id: [null, Validators.required],
      ubicacion: ['', [Validators.required, Validators.minLength(2)]],
      estado: ['DISPONIBLE' as EstadoTeam, Validators.required],
      observaciones: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.teamId = Number(idParam);

    if (!this.teamId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de equipo inválido'
      });
      this.router.navigate(['/teams/show']);
      return;
    }

    this.loadModalities();
    this.cargarEquipo();
  }

  /** ====== Helpers HTTP ====== */
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

  private cargarEquipo(): void {
    this.loading = true;
    this.teamService.getTeamById(this.teamId).subscribe({
      next: (team: TeamI) => {
        this.form.patchValue({
          nombre: team.nombre,
          modality_id: team.modality_id,
          ubicacion: team.ubicacion,
          estado: team.estado,
          observaciones: team.observaciones ?? ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando equipo', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el equipo'
        });
        this.router.navigate(['/teams/show']);
      }
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: Partial<TeamI> = this.form.value;

    this.teamService.updateTeam(this.teamId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Equipo actualizado correctamente'
        });
        this.router.navigate(['/teams/show']);
      },
      error: (err) => {
        console.error('Error actualizando equipo', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el equipo'
        });
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
}
