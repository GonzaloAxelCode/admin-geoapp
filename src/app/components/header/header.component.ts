import { Admin } from '@/app/models/auth.models';
import { SidebarService } from '@/app/services/ui/sidebar-service.service';
import { clearTokensAction } from '@/app/state/actions/auth.actions';
import { AppState } from '@/app/state/app.state';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiIcon,
  TuiPopup, TuiTextfield, TuiTitle
} from '@taiga-ui/core';
import {
  TuiAvatar, TuiBadge, TuiDataListWrapper, TuiDrawer,
  TuiFilterByInputPipe, TuiPulse, TuiStatus, TuiTooltip
} from '@taiga-ui/kit';
import { TuiCell, TuiNavigation, TuiSearch } from '@taiga-ui/layout';
import { DarkmodeComponent } from "../darkmode/darkmode.component";
import { LogowithnameComponent } from "../logowithname/logowithname.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe, CommonModule, ReactiveFormsModule, FormsModule,
    RouterModule, TuiCell, TuiAppearance, TuiNavigation, TuiDropdown,
    TuiSearch, TuiButton, TuiFilterByInputPipe, TuiTextfield, TuiPulse,
    TuiDataListWrapper, TuiTitle, DarkmodeComponent, TuiDrawer, TuiButton,
    TuiAppearance, TuiAvatar, TuiDataList, TuiStatus, TuiBadge,
    TuiPopup, TuiIcon, TuiTooltip, LogowithnameComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  user!: Admin;
  open = this.sidebarService.open;

  constructor(
    public sidebarService: SidebarService,
    private store: Store<AppState>,
    public router: Router
  ) {
    // 🔹 Recuperar el usuario del localStorage al inicializar el componente
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        if (authData?.admin) {
          this.user = authData.admin; // 👈 Seteamos el usuario
        }
      } catch (error) {
        console.error('Error al parsear authData:', error);
      }
    }
  }

  openSidebar() {
    this.open.set(true);
  }

  logout() {
    // 🔹 Limpiar el store
    this.store.dispatch(clearTokensAction());

    // 🔹 Eliminar datos del localStorage
    localStorage.removeItem('authData');

    // 🔹 Redirigir al login
    this.router.navigate(['/login']);
  }
}
