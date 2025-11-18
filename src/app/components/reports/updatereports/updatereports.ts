import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ReportService } from '../../../services/report';
import { AuthService } from '../../../services/auth';
import { InformeI, InformeEstado } from '../../../models/reports';

type Opt = { label: string; value: number };

@Component({
  selector: 'app-edit-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    ToastModule
  ],
  templateUrl: './updatereports.html',
  styleUrls: ['./updatereports.css'],
  providers: [MessageService]
})
export class Updatereports implements OnInit {
  form: FormGroup;
  loading = false;
  reportId!: number;

  estudios: Opt[] = [];
  medicos: Opt[] = [];

  estadoOpts = [
    { label: 'Borrador', value: 'BORRADOR' as InformeEstado },
    { label: 'Firmado', value: 'FIRMADO' as InformeEstado }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private reportService: ReportService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      estudio_id: [null, [Validators.required]],
      medico_id: [null, [Validators.required]],
      estado: ['BORRADOR' as InformeEstado, [Validators.required]],
      cuerpo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.reportId = Number(idParam);

    if (!this.reportId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de informe inválido'
      });
      this.router.navigate(['/reports/show']);
      return;
    }

    this.loadCombos();
    this.cargarInforme();
  }

  /** ===== Helpers HTTP ===== */

  private headers(): HttpHeaders {
    let h = new HttpHeaders();
    const t = this.auth.getToken?.();
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  private loadCombos(): void {
    // Estudios con nombre de paciente
    this.http.get<any>('http://localhost:4000/api/estudios', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.studies || data.estudios || []);

          this.estudios = (list || []).map((s: any) => {
            const p = s.patient ?? s.paciente_obj ?? null;
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

    // Médicos
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

  private cargarInforme(): void {
    this.loading = true;

    this.reportService.getReportById(this.reportId).subscribe({
      next: (resp: any) => {
        const report: InformeI = resp.report ?? resp; // por si viene envuelto
        this.form.patchValue({
          estudio_id: report.estudio_id,
          medico_id: report.medico_id,
          estado: report.estado,
          cuerpo: report.cuerpo
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando informe', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el informe'
        });
        this.router.navigate(['/reports/show']);
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

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.value; // Partial<InformeI> en backend

    this.reportService.updateReport(this.reportId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Informe actualizado correctamente'
        });
        this.router.navigate(['/reports/show']);
      },
      error: (err) => {
        console.error('Error actualizando informe', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.error || 'No se pudo actualizar el informe'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/reports/show']);
  }
}
