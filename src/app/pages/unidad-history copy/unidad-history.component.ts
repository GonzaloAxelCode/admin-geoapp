import { AsyncPipe, CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TuiLegendItem, TuiRingChart } from '@taiga-ui/addon-charts';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import { TuiDay, TuiHovered, tuiSum } from '@taiga-ui/cdk';
import { TuiCalendar, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputDate, TuiSkeleton } from '@taiga-ui/kit';

import { AppState } from '@/app/state/app.state';
import { loadTripsByDate } from '@/app/state/effects/trips.actions';
import { selectConductorState } from '@/app/state/selectors/conductor.selectors';
import { selectTripsState } from '@/app/state/selectors/trips.selectors';

import { MapaComponent } from '@/app/components/mapa/mapa.component';
import { Conductor, ConductoresState } from '@/app/models/conductor.model';
import { Trip, TripsState } from '@/app/models/trips.model';

@Component({
  selector: 'app-unidad-history',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AsyncPipe,
    NgForOf,
    // Taiga UI
    TuiCalendar,
    TuiInputDate,
    TuiTextfield,
    TuiSkeleton,
    TuiIcon,
    TuiAmountPipe,
    TuiHovered,
    TuiLegendItem,
    TuiRingChart,
    // Custom
    MapaComponent,
  ],
  templateUrl: './unidad-history.component.html',
  styleUrl: './unidad-history.component.scss'
})
export class UnidadHistoryComponent implements OnInit {
  protected readonly control = new FormControl<TuiDay | null>(null);
  protected readonly today = TuiDay.currentLocal();

  tripsState$?: Observable<TripsState>;
  trips: Trip[] = [];
  vueltas: any[] = [];

  conductor!: Conductor;
  userId!: number;

  fechas: Date[] = [];
  selectedDate!: Date;

  visibleCount = 7;
  offset = 0;
  dateWidth = 70 + 8;

  // datos de prueba
  protected activeItemIndex = NaN;
  protected readonly value = [13769, 12367, 10172, 3018, 2592];
  protected readonly sum = tuiSum(...this.value);
  protected readonly labels = ['Food', 'Cafe', 'OSS', 'Taxi', 'Other'];

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {


    this.control.setValue(this.today);
  }

  ngOnInit(): void {
    this.tripsState$ = this.store.select(selectTripsState);

    this.selectedDate = new Date();

    // 🔹 Detectar cambio en calendario Taiga UI
    this.control.valueChanges.subscribe((tuiDay: TuiDay | null) => {
      if (tuiDay) {
        const fecha = new Date(tuiDay.year, tuiDay.month, tuiDay.day);
        this.selectDate(fecha);
      }
    });

    // 🔹 Recoger userId desde ruta
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      console.log(params.get("id"))
      this.store.select(selectConductorState).subscribe((state: ConductoresState) => {
        const conductor = state.conductores.find(c => c.id_user === this.userId);
        if (conductor) this.conductor = conductor;
      });

      // cargar viajes del día actual
      const fechaISO = this.toISODate(this.today);
      this.store.dispatch(loadTripsByDate({ userId: this.userId, date: fechaISO }));


    });

    // 🔹 Suscribir a trips
    this.store.select(selectTripsState).subscribe((state) => {
      this.trips = state.trips;
      console.log(state.trips)
      // Transformar a "vueltas" (ejemplo simple)
      this.vueltas = this.trips.map((t, i) => ({
        titulo: `Viaje ${i + 1} - ${t.name_ruta}`,
        abierto: false,
        detalles: t.marcas.map(m => ({
          tramo: `${m.origin.name} → ${m.destination.name}`,
          hora: new Date(m.startDateTime).toLocaleTimeString(),
          delta: m.state,
          color: m.dateTimeMarca === "" ? 'red' : 'green'
        }))
      }));
    });

    this.generateDates();
    this.scrollToSelected();
  }

  // ------------ 📌 Helpers fechas ---------------
  generateDates(centerDate: Date = this.selectedDate): void {
    const start = new Date(centerDate.getFullYear(), centerDate.getMonth(), centerDate.getDate() - 7);
    const end = new Date(centerDate.getFullYear(), centerDate.getMonth(), centerDate.getDate() + 7);

    const dates: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    this.fechas = dates;
  }

  selectDate(fecha: Date): void {
    this.selectedDate = fecha;
    this.control.setValue(TuiDay.fromLocalNativeDate(fecha), { emitEvent: false });

    this.generateDates(fecha);
    this.scrollToSelected();

    // 🔹 Cargar viajes de la fecha seleccionada
    const fechaISO = this.toISODate(TuiDay.fromLocalNativeDate(fecha));
    this.store.dispatch(loadTripsByDate({ userId: this.userId, date: fechaISO }));
    console.log(fechaISO)
  }

  isSelected(fecha: Date): boolean {
    return (
      fecha.getFullYear() === this.selectedDate.getFullYear() &&
      fecha.getMonth() === this.selectedDate.getMonth() &&
      fecha.getDate() === this.selectedDate.getDate()
    );
  }

  prevDates(): void {
    this.offset = Math.max(0, this.offset - this.visibleCount * this.dateWidth);
  }

  nextDates(): void {
    const maxOffset = (this.fechas.length - this.visibleCount) * this.dateWidth;
    this.offset = Math.min(maxOffset, this.offset + this.visibleCount * this.dateWidth);
  }

  scrollToSelected(): void {
    const index = this.fechas.findIndex(f =>
      f.getFullYear() === this.selectedDate.getFullYear() &&
      f.getMonth() === this.selectedDate.getMonth() &&
      f.getDate() === this.selectedDate.getDate()
    );
    if (index >= 0) {
      const targetOffset = (index - Math.floor(this.visibleCount / 2)) * this.dateWidth;
      const maxOffset = (this.fechas.length - this.visibleCount) * this.dateWidth;
      this.offset = Math.max(0, Math.min(targetOffset, maxOffset));
    }
  }

  toISODate(tuiDay: TuiDay | null): string {
    if (!tuiDay) return '';
    const yyyy = tuiDay.year;
    const mm = String(tuiDay.month + 1).padStart(2, '0');
    const dd = String(tuiDay.day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // ------------ 📌 Vistas detalles ---------------
  toggle(vuelta: any) {
    vuelta.abierto = !vuelta.abierto;
  }

  isItemActive(index: number): boolean {
    return this.activeItemIndex === index;
  }

  onHover(index: number, hovered: boolean): void {
    this.activeItemIndex = hovered ? index : NaN;
  }
}
