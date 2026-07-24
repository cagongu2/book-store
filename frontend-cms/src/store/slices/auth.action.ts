import type { LoginPayload } from "../../features/auth/types/login.type";
import type { AppDispatch } from "../store";
import { logOut, setAuth, setLoading } from "./auth-slice";
import { login, logoutApi, profile } from "../../features/auth/services/auth.service";
import { mapAdminProfileToAuthUser, mapToAdminProfile } from "../../features/auth/utils/auth.mapper";

export const loginUser = (data: LoginPayload) => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));

        try {
            const response = await login(data);
            const {
                accessToken,
                refreshToken,
                expiresIn,
                adminProfile,
            } = response.data;

            dispatch(
                setAuth({
                    user: mapAdminProfileToAuthUser(adminProfile),
                    profile: mapToAdminProfile(adminProfile),
                    token: {
                        access: accessToken,
                        refresh: refreshToken,
                        accessExpiresIn: expiresIn,
                    },
                    syncToken: true,
                }),
            );
        } catch (error) {
            dispatch(setLoading(false));
            throw error;
        }
    };
};

export const getProfile = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));

        try {
            const response = await profile();
            const {
                accessToken,
                refreshToken,
                expiresIn,
                adminProfile,
            } = response.data;

            dispatch(
                setAuth({
                    user: mapAdminProfileToAuthUser(adminProfile),
                    profile: mapToAdminProfile(adminProfile),
                    token: {
                        access: accessToken,
                        refresh: refreshToken,
                        accessExpiresIn: expiresIn,
                    },
                    syncToken: true,
                }),
            );
        } catch (error) {
            dispatch(setLoading(false));
            throw error;
        }
    };
};

export const logoutUser = () => {
    return async (dispatch: AppDispatch) => {
        try {
            await logoutApi();
        } catch {
            // Ignore API logout error
        } finally {
            dispatch(logOut());
        }
    };
};