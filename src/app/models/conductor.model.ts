export interface ConductorForm {
    placa: string;
    password: string;
    firstname: string;
    dni: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    ruta: string;   // o puedes hacer tipo específico: typeof rutas[number]
    linea: string;  // o tipo específico: typeof lineas[number]
}
// Tipado para un conductor
export interface ConductorCreate {
    placa: string;
    password?: string;
    firstname: string;
    dni: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    ruta: string;
    linea: string;
}
export interface Conductor {
    id_user: number;
    active_user: number;        // 1 = activo, 0 = inactivo
    map_type: string;           // ejemplo: "default"
    show_notifications: number; // 1 = sí, 0 = no
    username: string;
    theme: string;              // ejemplo: "light" o "dark"
    voice_enabled: number;      // 1 = activado, 0 = desactivado
    nombres: string;
    apellidos: string;
    dni: string;
    placa_auto: string;
    correo_electronico: string;
    telefono: string;
    direccion: string;
    password: string;
}

// Estado inicial para los conductores
export interface ConductoresState {
    conductores: Conductor[];
    loadingCreateConductor: boolean;
    loadingLoadConductores: boolean;
    error?: any;
}