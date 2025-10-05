import { SidebarService } from '@/app/services/ui/sidebar-service.service';
import { clearTokensAction } from '@/app/state/actions/auth.actions';
import { AppState } from '@/app/state/app.state';
import { selectAuth } from '@/app/state/selectors/auth.selectors';
import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLinkActive, RouterLinkWithHref, RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDialogService,
  TuiDropdown,
  TuiFallbackSrcPipe,
  TuiIcon,
  TuiPopup,
  TuiTextfield
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiAvatarLabeled,
  TuiDrawer,
  TuiTabs
} from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { map, Observable } from 'rxjs';
import { HeaderComponent } from "../header/header.component";
import { LogowithnameComponent } from "../logowithname/logowithname.component";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule, RouterModule,
    FormsModule,
    NgIf,
    TuiDataList,
    TuiDropdown,
    TuiNavigation,
    TuiTabs, TuiAvatarLabeled, TuiFallbackSrcPipe,
    TuiTextfield, RouterLinkActive, RouterLinkWithHref, TuiIcon, HeaderComponent,
    TuiDropdownMobile,
    TuiDrawer, TuiButton, TuiAppearance,
    TuiAvatar,
    TuiPopup, LogowithnameComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  isAuthenticated$: Observable<any>;



  constructor(private store: Store<AppState>, public router: Router, public sidebarService: SidebarService) {

    this.isAuthenticated$ = this.store.select(selectAuth).pipe(
      map(authState => authState.isAuthenticated)
    );


    this.loadingAuthenticated$ = this.store.select(selectAuth).pipe(
      map(authState => authState.loadingCheckAuthenticated)
    );


  }

  loadingAuthenticated$: Observable<any>;
  authState$ = this.store.pipe(select(selectAuth));

  logout() {
    this.store.dispatch(clearTokensAction())
    this.onClose();
    this.router.navigate(['/login']);
  }
  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
  protected readonly dialogs = inject(TuiDialogService);


  open = this.sidebarService.open
  public onClose(): void {
    this.open.set(false);

  }
  //user menu 

  protected readonly itemsMenuUser = ['Edit', 'Download', 'Rename', 'Delete'];

  protected openMenuUser = false;

  protected onClickMenuUser(): void {
    this.openMenuUser = false;
  }





}
