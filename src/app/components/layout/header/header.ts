import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import { OverlayBadge } from 'primeng/overlaybadge';

import { AuthService } from '../../../services/auth'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, OverlayBadge, TieredMenu],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  isLoggedIn = false;
  private authSubscription?: Subscription;
   notificationsCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.updateMenuItems();

    // 🔁 Escuchar los cambios del estado de autenticación
    this.authSubscription = this.authService.authState$.subscribe(() => {
      this.updateMenuItems();
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  private updateMenuItems(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.items = [
        {
          label: 'Perfil',
          icon: 'pi pi-id-card',
          command: () => this.goToProfile()
        },
        {
          label: 'Opciones',
          icon: 'pi pi-cog',
          command: () => this.goToOptions()
        },
        { separator: true },
        {
          label: 'Cerrar sesión',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      ];
    } else {
      this.items = [
        {
          label: 'Iniciar sesión',
          icon: 'pi pi-sign-in',
          command: () => this.goToLogin()
        },
        {
          label: 'Registrarse',
          icon: 'pi pi-user-plus',
          command: () => this.goToRegister()
        }
      ];
    }
  }

  private goToProfile(): void {
    console.log('Perfil clicked');
    // Ejemplo: this.router.navigate(['/perfil']);
  }

  private goToOptions(): void {
    console.log('Opciones clicked');
    // Ejemplo: this.router.navigate(['/opciones']);
  }

  private logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
