import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiButton, TuiDataList, TuiDialogContext, TuiDropdown, TuiError, TuiExpand, TuiLabel, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiSwitch } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/legacy';

import { ConductoresState } from '@/app/models/conductor.model';
import { createConductor, createConductorFail, createConductorSuccess } from '@/app/state/actions/conductor.actions';
import { AppState } from '@/app/state/app.state';
import { selectConductorState } from '@/app/state/selectors/conductor.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { TuiDataListWrapper, TuiTabs } from '@taiga-ui/kit';
import { TuiComboBoxModule, TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialogcreateconductor',
  standalone: true,
  imports: [
    CommonModule, TuiLoader,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiError,
    TuiButton,
    TuiDataListWrapper, TuiLabel,
    TuiDataList,
    TuiTextfield,
    FormsModule, TuiComboBoxModule,
    TuiSelectModule, TuiTabs, TuiTextfieldControllerModule, TuiDropdown, TuiExpand,
    TuiSwitch
  ],
  templateUrl: './dialogcreateconductor.component.html',
  styleUrl: './dialogcreateconductor.component.scss',
})
export class DialogcreateconductorComponent {
  protected expanded = false;
  protected readonly context = injectContext<TuiDialogContext<boolean, Partial<any>>>();
  formConductor: FormGroup;

  readonly themes = ['light', 'dark'];
  readonly mapTypes = ['default', 'satellite', 'terrain'];

  loadingCreateConductor$!: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store<AppState>, private actions$: Actions) {
    this.formConductor = this.fb.group({
      // Datos obligatorios
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      placa_auto: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{3}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],

      // Datos opcionales
      correo_electronico: ['', [Validators.email]],
      direccion: [''],

      // Configuraciones
      active_user: [1],
      show_notifications: [1],
      theme: ['light'],
      voice_enabled: [0],
      map_type: ['default']
    });
  }

  ngOnInit() {
    this.loadingCreateConductor$ = this.store.select(selectConductorState).pipe(
      map((state: ConductoresState) => state.loadingCreateConductor)
    );

    this.actions$.pipe(
      ofType(createConductorSuccess, createConductorFail),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.context.completeWith(true);
    });
  }

  onSubmit(): void {
    if (this.formConductor.valid) {
      const formData = {
        ...this.formConductor.value,
        // Asegurar que los valores booleanos sean números
        active_user: this.formConductor.value.active_user ? 1 : 0,
        show_notifications: this.formConductor.value.show_notifications ? 1 : 0,
        voice_enabled: this.formConductor.value.voice_enabled ? 1 : 0
      };

      console.log('Conductor a enviar:', formData);
      this.store.dispatch(createConductor({ conductor: formData }));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}