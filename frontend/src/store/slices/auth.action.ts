import authenticationApi from "@/actions/auth";
import { mapAdminProfileToAuthUser } from "@/features/auth/utils/auth.mapper";
import { mapToAdminProfile } from "@/features/profile/utils/profile.mapper";
import type { LoginPayload } from "@/features/auth/types/login.type";
import type { AppDispatch } from "@/store/store";
import { getAccessToken } from "@/utils/auth-token";
import { logOut, setAuth, setLoading } from "./auth-slice";

export const loginUser = (data: LoginPayload) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await authenticationApi.login(data);
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
    const token = getAccessToken();
    if (!token) return;

    dispatch(setLoading(true));

    try {
      const response = await authenticationApi.profile();

      dispatch(
        setAuth({
          user: mapAdminProfileToAuthUser(response.data),
          profile: mapToAdminProfile(response.data),
          token: { access: token },
          syncToken: false,
        }),
      );
    } catch (error) {
      dispatch(logOut());
      return Promise.reject(error);
    }
  };
};
