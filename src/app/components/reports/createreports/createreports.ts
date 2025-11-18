import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';

import { AuthService } from '../../../services/auth';
import { ReportService } from '../../../services/report';
import { InformeCreateI, InformeEstado } from '../../../models/reports';

type Opt = { label: string; value: number };

@Component({
  selector: 'app-create-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    Select
  ],
  templateUrl: './createreports.html',
  styleUrls: ['./createreports.css'],
  providers: [MessageService]
})
export class Createreports implements OnInit {
  form!: FormGroup;
  loading = false;

  
  estudios: Opt[] = [];
  medicos: Opt[] = [];

  estadoOpts: { label: string; value: InformeEstado }[] = [
    { label: 'Borrador', value: 'BORRADOR' },
    { label: 'Firmado', value: 'FIRMADO' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private reportService: ReportService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      estudio_id: [null, Validators.required],
      medico_id: [null, Validators.required],
      estado: ['BORRADOR' as InformeEstado, Validators.required],
      cuerpo: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.loadCombos();
  }

  

  private headers(): HttpHeaders {
    let h = new HttpHeaders();
    const t = this.auth.getToken?.();
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  private loadCombos(): void {
    
    this.http.get<any>('http://localhost:4000/api/estudios', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.studies || data.estudios || []);

          this.estudios = (list || []).map((s: any) => {
            const p =
              s.patient ??
              s.paciente_obj ??
              null;

            const nombrePaciente = p
              ? `${p.nombre ?? ''} ${p.apellido ?? ''}`.trim()
              : `Paciente #${s.patient_id}`;

            return {
              label: `${nombrePaciente} - Estudio #${s.id}`,
              value: s.id
            };
          });
        },
        error: (err) => {
          console.error('Error cargando estudios:', err);
        }
      });

    
    this.http.get<any>('http://localhost:4000/api/doctores', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.doctors || data.doctores || []);

          this.medicos = (list || []).map((d: any) => {
            const nombre = `${d.nombre ?? ''} ${d.apellido ?? ''}`.trim() || `Médico #${d.id}`;
            const especialidad = d.especialidad ? ` - ${d.especialidad}` : '';
            return {
              label: `${nombre}${especialidad}`,
              value: d.id
            };
          });
        },
        error: (err) => {
          console.error('Error cargando doctores:', err);
        }
      });
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

    const payload: InformeCreateI = {
      estudio_id: v.estudio_id,
      medico_id: v.medico_id,
      estado: v.estado,
      cuerpo: v.cuerpo
    };

    this.loading = true;

    this.reportService.createReport(payload).subscribe({
      next: (report) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Informe #${report.id} creado`
        });
        setTimeout(() => this.router.navigate(['/reports/show']), 700);
      },
      error: (err) => {
        console.error('Error creando informe:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.error || 'No se pudo crear el informe'
        });
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/reports/show']);
  }
}
