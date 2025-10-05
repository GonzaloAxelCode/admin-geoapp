import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';


import { AuthlayoutComponent } from './layouts/authlayout/authlayout.component';
import { MainlayoutComponent } from './layouts/mainlayout/mainlayout.component';

import { loginGuard } from './guards/login.guard';
import { ConductoresComponent } from './pages/conductores/conductores.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RutasComponent } from './pages/rutas/rutas.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UnidadHistoryComponent } from './pages/unidad-history/unidad-history.component';




const routes: Routes = [
	// Rutas para USUARIOS NORMALES - Solo accesibles por usuarios no-superusuarios
	{
		path: 'admin',
		component: MainlayoutComponent,
		canActivate: [authGuard],
		canActivateChild: [authGuard],
		children: [
			{ path: '', component: DashboardComponent },
			{ path: 'rutas', component: RutasComponent },
			{ path: 'settings', component: SettingsComponent },
			{ path: 'conductores', component: ConductoresComponent },
			{ path: 'unidad/:id', component: UnidadHistoryComponent },

		]
	},

	// Ruta de login
	{
		path: 'login',
		component: AuthlayoutComponent,
		canActivate: [loginGuard],
		canActivateChild: [loginGuard],
		children: [{ path: '', component: LoginComponent }]
	},
	// Redirección por defecto basada en rol
	{
		path: '',
		canActivate: [authGuard,],
		canActivateChild: [authGuard],
		redirectTo: 'admin',
	},
	// Página 404
	{ path: '**', component: NotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }