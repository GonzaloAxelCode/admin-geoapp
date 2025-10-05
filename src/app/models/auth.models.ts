
export interface AuthState {

    admin: Admin
    errors?: any;
    isLoadingLogin: boolean;
    isLoadingLogout: boolean,
    isAuthenticated?: boolean;
    accessToken?: string;
    refreshToken?: string;
    loadingCheckAuthenticated?: boolean
}


export interface Admin {
    id_admin: number
    username: string
}
