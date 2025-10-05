import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiDataList, TuiDropdown, TuiDropdownSelection, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputModule, TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

import { Conductor } from '@/app/models/conductor.model';
import { AppState } from '@/app/state/app.state';
import { selectConductorState } from '@/app/state/selectors/conductor.selectors';
import { Store } from '@ngrx/store';
import {
  TuiBadge,
  TuiChevron,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiStatus,
  TuiTooltip,
} from '@taiga-ui/kit';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    TuiChevron,
    TuiDataListWrapper,
    TuiDropdown,
    TuiFilterByInputPipe,
    TuiIcon,
    TuiDropdownSelection,
    TuiTextfield,
    TuiTooltip,
    RouterLink,
    NgForOf,
    ReactiveFormsModule,
    TuiInputModule,
    TuiDataList,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiBadge,
    TuiStatus
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  protected value = '';

  private searchQuery$ = new BehaviorSubject<string>('');

  vm$!: Observable<{
    conductores: Conductor[];
    isLoading: boolean;
    searchQuery: string;
  }>;

  constructor(private fb: FormBuilder, private store: Store<AppState>) { }

  ngOnInit(): void {
    const state$ = this.store.select(selectConductorState);

    this.vm$ = combineLatest([state$, this.searchQuery$]).pipe(
      map(([state, query]) => {
        const lower = query.toLowerCase().trim();

        let filteredConductores = state.conductores || [];

        if (lower) {
          filteredConductores = filteredConductores.filter((c) =>
            c.placa_auto?.toLowerCase().includes(lower) ||
            c.nombres?.toLowerCase().includes(lower) ||
            c.username?.toLowerCase().includes(lower)
          );
        }

        return {
          conductores: filteredConductores,
          isLoading: state.loadingLoadConductores,
          searchQuery: query
        };
      })
    );
  }

  onSearchChange(query: string): void {
    this.searchQuery$.next(query);
  }
}