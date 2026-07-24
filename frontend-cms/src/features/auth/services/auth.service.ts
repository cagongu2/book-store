import { axiosClient } from "../../../core/api/axios-client";
import { ApiRouters } from "../../../constants/api-routes";
import { cleanObjectParams } from "../../../utils/format";
import type { LoginPayload } from "../types/login.type";

export const login = async (data: LoginPayload) => {
    const url = `${ApiRouters.AUTH}/login`;
    const params = cleanObjectParams(data);
    const response = await axiosClient.post(url, params);
    return response.data;
};

export const profile = async () => {
    const url = `${ApiRouters.PROFILE}/me`;
    const response = await axiosClient.get(url);
    return response.data;
};

export const refreshTokenApi = async () => {
    const url = `${ApiRouters.AUTH}/refresh`;
    const response = await axiosClient.post(url, {});
    return response.data;
};

export const logoutApi = async () => {
    const url = `${ApiRouters.AUTH}/logout`;
    const response = await axiosClient.post(url, {});
    return response.data;
};