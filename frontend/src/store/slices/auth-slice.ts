import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { MEBIPHA_ACCESS_TOKEN } from "@/constants/cookies";
import { removeTokenAuth, setTokenAuth } from "@/utils/auth-token";
import {
  AppPermission,
  AppRole,
} from "@/features/auth/constants/access-control";
import type { AuthUser } from "@/features/auth/models/auth.model";
import type {
  AdminProfile,
  UpdateProfilePayload,
} from "@/features/profile/types/admin-profile.type";

export interface AuthTokenPayload {
  access: string;
  refresh?: string;
  accessExpiresIn?: number;
}

export interface SetAuthPayload {
  user: AuthUser;
  token: AuthTokenPayload;
  profile?: AdminProfile;
  syncToken?: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  profile: AdminProfile | null;
  loading: boolean;
}

const storedToken = Cookies.get(MEBIPHA_ACCESS_TOKEN) ?? null;

const initialState: AuthState = {
  accessToken: storedToken,
  user: storedToken
    ? {
        id: "",
        name: "",
        roles: [AppRole.ADMINISTRATORS],
        permissions: [AppPermission.ALL],
      }
    : null,
  profile: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuth: (state, action: PayloadAction<SetAuthPayload>) => {
      state.accessToken = action.payload.token.access;
      state.user = action.payload.user;
      state.loading = false;

      if (action.payload.profile) {
        state.profile = action.payload.profile;
      }

      if (action.payload.syncToken !== false) {
        setTokenAuth({
          access: action.payload.token.access,
          refresh: action.payload.token.refresh,
          accessExpiresIn: action.payload.token.accessExpiresIn,
        });
      }
    },
    logOut: (state) => {
      state.accessToken = null;
      state.user = null;
      state.profile = null;
      state.loading = false;
      removeTokenAuth();
    },
    patchProfile: (state, action: PayloadAction<UpdateProfilePayload>) => {
      if (!state.profile || !state.user) return;

      const { fullName, email, phone, avatar } = action.payload;
      state.profile.fullName = fullName ?? "";
      state.profile.email = email ?? "";
      state.profile.phone = phone;
      state.profile.avatar = avatar;
      state.user.name = fullName ?? "";
    },
  },
});

export const { setAuth, setLoading, logOut, patchProfile } = authSlice.actions;
export default authSlice.reducer;
