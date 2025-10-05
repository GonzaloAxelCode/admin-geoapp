export interface TripResponse {
    success: boolean;
    message: string;
    trips: Trip[];
}

export interface Trip {
    id_trip: string | any;
    state_trip: "NEVER" | "ACTIVE" | "INACTIVE" | string
    startDateTime: string
    endDateTime: string
    name_ruta: string
    date_created?: string
    id_user: number,
    marcas: TramoMarca[]
}



export interface TramoMarca {
    id: number;
    origin: {
        lat: number;
        lon: number;
        name: string
    };
    destination: {
        lat: number;
        lon: number;
        name: string
    };
    startDateTime: string;
    endtDateTime: string;
    isEndTramo: number;
    state: string,
    dateTimeMarca: string;
    idTrip: number;
    order: number,
    tiempo_demora_establecido: string
    direccion: string,
    semaltoTramos?: number; // 🆕
    cantidadTramosSaltados?: number; // 🆕
    tramosSaltadosDetalle?: string[]; // 🆕
}

// Estado inicial para trips 
export interface TripsState {
    trips: Trip[];
    loadingTripsByDate: boolean
    loadingLoadTrips: boolean;
    error: string | null;
}