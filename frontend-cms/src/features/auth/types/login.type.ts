export interface LoginPayload {
    username: string;
    password: string;
}

export interface AdminProfileData {
    id: string;
    fullName: string | null;
    userName: string | null;
    email: string | null;
    phone: string | null;
    avatar: string | null;
    roles: string[];
    isActivated: boolean;
}
export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    adminProfile: AdminProfileData;
}