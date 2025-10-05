import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NG_EVENT_PLUGINS } from "@taiga-ui/event-plugins";

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';




import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/utils/http-auth-interceptor';
import { ROOT_REDUCER } from './state/app.state';
import { AuthEffects } from './state/effects/auth.effects';


import { provideToastr, ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { TuiNotification, TuiRoot } from '@taiga-ui/core';

import { AppEffects } from './state/effects/app.effects';
import { ConductorEffects } from './state/effects/conductor.effects';
import { TripsEffects } from './state/effects/trips.effect';


@NgModule({

	declarations: [AppComponent],
	imports: [
		BrowserAnimationsModule,
		TuiNotification,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		LoginComponent,
		CommonModule,
		TuiRoot,

		ToastrModule.forRoot({

		}),
		StoreModule.forRoot(ROOT_REDUCER),
		EffectsModule.forRoot([
			AppEffects,
			AuthEffects,
			ConductorEffects,
			TripsEffects
		]),
		TranslateModule.forRoot({
			defaultLanguage: 'en',
		}),
	],
	providers: [
		AuthService,

		provideAnimations(),
		provideToastr(),

		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		NG_EVENT_PLUGINS,
	],

	bootstrap: [
		AppComponent
	],

	schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
