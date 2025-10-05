import { zonesiloruta2_miramar } from '@/app/data/rutas';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
const busIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, TuiIcon],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {
  private map!: L.Map;
  private busMarker!: L.Marker;

  isAnimating = false;
  private animationFrameId!: number;

  // Variables para el estado de la animación
  private rutaUnica: L.LatLngTuple[] = [];
  private currentIndex = 0;
  private nextIndex = 1;
  private t = 0; // interpolación 0..1
  private fps = 60;
  private duracionEntrePuntos = 5000;
  private step = 0;
  private mapDiv!: HTMLElement;

  ngAfterViewInit(): void {
    this.initMap();
    this.loadMarkers();
    this.prepareRoute();
    this.animate();

  }
  expandMap(): void {
    this.mapDiv.style.height = '400px';
    setTimeout(() => this.map.invalidateSize(), 510); // después de la transición
  }

  shrinkMap(): void {
    this.mapDiv.style.height = '100px';
    setTimeout(() => this.map.invalidateSize(), 510);
  }
  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      this.animate(); // continuará desde el punto actual
    } else {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initMap(): void {
    this.mapDiv = document.getElementById('map')!;

    this.mapDiv.addEventListener('transitionend', () => {
      if (this.map) this.map.invalidateSize(); // ajusta Leaflet cuando termina la transición
    });

    this.map = L.map('map', {
      center: [-17.646453, -71.309143],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadMarkers(): void {
    const bounds: L.LatLngTuple[] = [];
    const puntosVistos = new Set<string>();

    zonesiloruta2_miramar.forEach((segmento: any) => {
      const origenKey = `${segmento.center_origen_lon},${segmento.center_origen_lat}`;
      if (!puntosVistos.has(origenKey)) {
        const marker = L.marker([segmento.center_origen_lon, segmento.center_origen_lat]).addTo(this.map);
        marker.bindPopup(`<b>${segmento.nombre_origen_ubicacion}</b><br>Tiempo estimado: ${segmento.tiempo_demora_establecido}`).openPopup();
        puntosVistos.add(origenKey);
        bounds.push([segmento.center_origen_lon, segmento.center_origen_lat]);
      }

      const destinoKey = `${segmento.center_destino_lon},${segmento.center_destino_lat}`;
      if (!puntosVistos.has(destinoKey)) {
        const marker = L.marker([segmento.center_destino_lon, segmento.center_destino_lat]).addTo(this.map);
        marker.bindPopup(`<b>${segmento.nombre_destino_ubicacion}</b><br>Tiempo estimado: ${segmento.tiempo_demora_establecido}`).openPopup();
        puntosVistos.add(destinoKey);
        bounds.push([segmento.center_destino_lon, segmento.center_destino_lat]);
      }
    });

    this.map.fitBounds(bounds, { padding: [100, 100] });

    const primerPunto = zonesiloruta2_miramar[0];
    this.busMarker = L.marker([primerPunto.center_origen_lon, primerPunto.center_origen_lat], {
      icon: busIcon,
      title: 'Bus en ruta'
    }).addTo(this.map);
  }

  private prepareRoute(): void {
    const puntosRuta = zonesiloruta2_miramar.flatMap((seg: any) => [
      [seg.center_origen_lon, seg.center_origen_lat],
      [seg.center_destino_lon, seg.center_destino_lat]
    ]);

    const seen = new Set<string>();
    this.rutaUnica = [];
    puntosRuta.forEach((p: any) => {
      const key = `${p[0]},${p[1]}`;
      if (!seen.has(key)) {
        seen.add(key);
        this.rutaUnica.push(p);
      }
    });

    this.step = 1 / (this.duracionEntrePuntos / (1000 / this.fps));
  }

  private animate(): void {
    if (!this.isAnimating) return;

    const [x0, y0] = this.rutaUnica[this.currentIndex];
    const [x1, y1] = this.rutaUnica[this.nextIndex];

    const lat = x0 + (x1 - x0) * this.t;
    const lon = y0 + (y1 - y0) * this.t;
    this.busMarker.setLatLng([lat, lon]);
    this.map.panTo([lat, lon], { animate: false });

    this.t += this.step;
    if (this.t >= 1) {
      this.t = 0;
      this.currentIndex = this.nextIndex;
      this.nextIndex = (this.nextIndex + 1) % this.rutaUnica.length;
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}
