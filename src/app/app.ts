import { Component, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { Header } from './components/layout/header/header';
import { Aside } from './components/layout/aside/aside';
import { Footer } from './components/layout/footer/footer';
import { AuthService } from './services/auth'; // ajusta ruta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Header, Aside, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('radiologia');

  // ✅ signal reactiva del estado de auth
  isLoggedInSig!: Signal<boolean>;

  constructor(public authService: AuthService) {
    this.isLoggedInSig = toSignal(this.authService.authState$, { initialValue: this.authService.isLoggedIn() });
  }
}
