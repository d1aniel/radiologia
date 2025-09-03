import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, TooltipModule, MenuModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  // Eventos opcionales para que el contenedor decida qué hacer
  @Output() perfil = new EventEmitter<void>();
  @Output() opciones = new EventEmitter<void>();
  @Output() cerrarSesion = new EventEmitter<void>(); // placeholder por ahora

  userItems: MenuItem[] = [
    { label: 'Perfil', icon: 'pi pi-id-card', command: () => this.perfil.emit() },
    { label: 'Opciones', icon: 'pi pi-cog', command: () => this.opciones.emit() },
    { separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.cerrarSesion.emit() } // aún sin lógica
  ];
}
