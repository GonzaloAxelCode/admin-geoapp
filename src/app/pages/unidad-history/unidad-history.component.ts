import { AsyncPipe, CommonModule, NgForOf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TuiDay } from '@taiga-ui/cdk';
import { TuiCalendar, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputDate, TuiSkeleton } from '@taiga-ui/kit';


import { AppState } from '@/app/state/app.state';
import { selectConductorState } from '@/app/state/selectors/conductor.selectors';
import { selectTripsState } from '@/app/state/selectors/trips.selectors';

import { MapaComponent } from '@/app/components/mapa/mapa.component';
import { Conductor, ConductoresState } from '@/app/models/conductor.model';
import { Trip, TripsState } from '@/app/models/trips.model';
import { loadTripsByDate } from '@/app/state/effects/trips.actions';

@Component({
  selector: 'app-unidad-history',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AsyncPipe,
    NgForOf,
    TuiCalendar,
    TuiInputDate,
    TuiTextfield,
    TuiIcon,
    TuiSkeleton,
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
  selectedDate!: Date;

  isLoading = false;

  // Estadísticas del día
  estadisticas = {
    totalViajes: 0,
    viajesATiempo: 0,
    viajesRetrasados: 0,
    tramosCompletados: 0,
    tramosSaltados: 0,
    promedioRetraso: 0,
    tiempoTotalViaje: 0,
    porcentajePuntualidad: 0
  };

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef
  ) {
    this.control.setValue(this.today);
  }

  ngOnInit(): void {
    this.tripsState$ = this.store.select(selectTripsState);
    this.selectedDate = new Date();

    // 🔹 Recoger userId desde ruta PRIMERO
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      console.log('User ID:', this.userId);

      if (this.userId) {
        // Cargar conductor
        this.store.select(selectConductorState).subscribe((state: ConductoresState) => {
          const conductor = state.conductores.find(c => c.id_user === this.userId);
          if (conductor) {
            this.conductor = conductor;
            console.log('Conductor encontrado:', conductor);
          }
        });

        // Cargar viajes del día actual
        this.loadTripsForDate(this.today);
      }
    });

    // 🔹 Detectar cambio en calendario Taiga UI
    this.control.valueChanges.subscribe((tuiDay: TuiDay | null) => {
      if (tuiDay && this.userId) {
        const fecha = new Date(tuiDay.year, tuiDay.month, tuiDay.day);
        this.selectedDate = fecha;
        this.loadTripsForDate(tuiDay);
      }
    });

    // 🔹 Suscribir a trips y loading state
    this.store.select(selectTripsState).subscribe((state) => {
      this.isLoading = state.loadingTripsByDate;
      this.trips = state.trips;
      console.log('Trips recibidos:', state.trips);
      console.log('Loading:', this.isLoading);

      // Calcular estadísticas
      this.calcularEstadisticas();

      // Transformar a "vueltas"
      this.vueltas = this.trips.map((t, i) => ({
        titulo: `Viaje ${i + 1} - ${t.name_ruta}`,
        abierto: false,
        horaInicio: t.marcas[0]?.startDateTime || '',
        horaFin: t.marcas[t.marcas.length - 1]?.endtDateTime || '',
        totalTramos: t.marcas.length,
        tramosATiempo: t.marcas.filter(m => m.dateTimeMarca !== "").length,
        detalles: t.marcas.map(m => {
          const inicio = new Date(m.startDateTime);
          const fin = m.endtDateTime ? new Date(m.endtDateTime) : null;
          const marca = m.dateTimeMarca ? new Date(m.dateTimeMarca) : null;

          let retraso = 0;
          let estado = 'Sin marcar';
          let color = 'gray';

          if (marca && fin) {
            retraso = Math.floor((marca.getTime() - fin.getTime()) / 60000); // minutos
            if (retraso <= 0) {
              estado = 'A tiempo';
              color = 'green';
            } else if (retraso <= 5) {
              estado = `+${retraso}min`;
              color = 'yellow';
            } else {
              estado = `+${retraso}min`;
              color = 'red';
            }
          } else if (m.dateTimeMarca === "") {
            estado = 'Sin marcar';
            color = 'gray';
          }

          return {
            tramo: `${m.origin.name} → ${m.destination.name}`,
            horaInicio: inicio.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            horaFin: fin ? fin.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '--:--',
            horaMarca: marca ? marca.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '--:--',
            estado,
            retrasoMinutos: retraso,
            color,
            saltado: m.semaltoTramos
          };
        })
      }));

      // Forzar detección de cambios
      this.cdr.detectChanges();
    });
  }

  calcularEstadisticas(): void {
    if (this.trips.length === 0) {
      this.estadisticas = {
        totalViajes: 0,
        viajesATiempo: 0,
        viajesRetrasados: 0,
        tramosCompletados: 0,
        tramosSaltados: 0,
        promedioRetraso: 0,
        tiempoTotalViaje: 0,
        porcentajePuntualidad: 0
      };
      return;
    }

    let totalRetrasos = 0;
    let contadorRetrasos = 0;
    let tramosCompletados = 0;
    let tramosSaltados = 0;
    let viajesATiempo = 0;
    let viajesRetrasados = 0;

    this.trips.forEach(trip => {
      let viajeConRetraso = false;

      trip.marcas.forEach(marca => {
        if (marca.semaltoTramos) {
          tramosSaltados++;
        }

        if (marca.dateTimeMarca && marca.dateTimeMarca !== "") {
          tramosCompletados++;

          const marcaTime = new Date(marca.dateTimeMarca).getTime();
          const esperadoTime = new Date(marca.endtDateTime).getTime();
          const retrasoMin = Math.floor((marcaTime - esperadoTime) / 60000);

          if (retrasoMin > 0) {
            totalRetrasos += retrasoMin;
            contadorRetrasos++;
            viajeConRetraso = true;
          }
        }
      });

      if (viajeConRetraso) {
        viajesRetrasados++;
      } else {
        viajesATiempo++;
      }
    });

    const promedioRetraso = contadorRetrasos > 0 ? totalRetrasos / contadorRetrasos : 0;
    const totalTramos = tramosCompletados + tramosSaltados;
    const porcentajePuntualidad = totalTramos > 0 ? (tramosCompletados / totalTramos) * 100 : 0;

    this.estadisticas = {
      totalViajes: this.trips.length,
      viajesATiempo,
      viajesRetrasados,
      tramosCompletados,
      tramosSaltados,
      promedioRetraso: Math.round(promedioRetraso),
      tiempoTotalViaje: 0, // Puedes calcularlo si tienes los timestamps
      porcentajePuntualidad: Math.round(porcentajePuntualidad)
    };
  }

  loadTripsForDate(tuiDay: TuiDay): void {
    const fechaISO = this.toISODate(tuiDay);
    console.log('Cargando trips para:', fechaISO);
    this.store.dispatch(loadTripsByDate({ userId: this.userId, date: fechaISO }));
  }

  toISODate(tuiDay: TuiDay): string {
    const yyyy = tuiDay.year;
    const mm = String(tuiDay.month + 1).padStart(2, '0');
    const dd = String(tuiDay.day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  toggle(vuelta: any): void {
    vuelta.abierto = !vuelta.abierto;
  }

  formatTime(dateString: string): string {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }
}