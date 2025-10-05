import { AppState } from '@/app/state/app.state';
import { CommonModule, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAlertService, TuiButton, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiBadge, TuiChevron, TuiConfirmService, TuiDataListWrapper, TuiFilter, TuiPagination, TuiRadio, TuiSegmented, TuiSkeleton, TuiSwitch } from '@taiga-ui/kit';
import { Observable } from 'rxjs';

import { Conductor, ConductoresState } from '@/app/models/conductor.model';
import { selectConductorState } from '@/app/state/selectors/conductor.selectors';
import type { TuiConfirmData } from '@taiga-ui/kit';
import { TuiBlockStatus, TuiCardLarge, TuiSearch } from '@taiga-ui/layout';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-tableconductores',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    TuiBadge,
    TuiRadio,
    FormsModule,
    TuiTable,
    TuiBlockStatus, TuiButton, TuiSkeleton, TuiCardLarge, TuiChevron,
    TuiDataListWrapper,
    TuiFilter,
    TuiSegmented,
    TuiSwitch, TuiTextfield, TuiSearch, FormsModule, TuiDataListWrapper, NgForOf, TuiLoader,
    TuiSelectModule, TuiTextfieldControllerModule, TuiPagination, TuiIcon
  ],
  templateUrl: './tableconductores.component.html',
  styleUrl: './tableconductores.component.scss',
  providers: [TuiConfirmService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableconductoresComponent implements OnInit {
  conductoresState$?: Observable<ConductoresState>;
  conductores!: Conductor[]

  allColumns = [
    { key: 'username', label: 'Usuario' },
    { key: 'nombres', label: 'Nombre' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'dni', label: 'DNI' },

    { key: 'telefono', label: 'Teléfono' },

    { key: 'placa_auto', label: 'Placa' },

    { key: 'active_user', label: 'Activo' }
  ];



  filteredData: any = []
  allColumnKeys = this.allColumns.map(c => c.key);
  displayedColumns = this.allColumns.map(c => c.key);

  private readonly dialogs = inject(TuiResponsiveDialogService);
  private readonly alerts = inject(TuiAlertService);
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    this.conductoresState$ = this.store.select(selectConductorState);

    this.store.select(selectConductorState).subscribe((state) => {
      this.conductores = state.conductores
    })


  }


  protected onDeleteConductor(conductor: Conductor): void {
    const data: TuiConfirmData = {
      content: '¿Estás seguro de que deseas eliminar este CConductor?',
      yes: 'Eliminar',
      no: 'Cancelar',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirmación de Eliminación',
        size: 's',
        data,
      })
      .subscribe((confirm) => {
        if (confirm) {

          this.alerts.open('Producto eliminado exitosamente.(test)').subscribe();
        } else {

          this.alerts.open('Eliminación cancelada.(test)').subscribe();
        }
      });
  }



}
