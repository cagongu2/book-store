export const AppRole = {
    ADMINISTRATORS: "ADMINISTRATORS",
} as const;

export type AppRole = (typeof AppRole)[keyof typeof AppRole];

export const API_ROLE_MAP: Record<string, AppRole> = {
    Administrator: AppRole.ADMINISTRATORS,
    ADMINISTRATORS: AppRole.ADMINISTRATORS,
};

export const mapApiRoles = (roles: string[] = []): AppRole[] =>
    roles
        .map((role) => API_ROLE_MAP[role])
        .filter((role): role is AppRole => role !== undefined);

export const AppPermission = {
    ALL: "*",
    DASHBOARD_VIEW: "dashboard:view",
    PRODUCT_VIEW: "product:view",
    BOOK_VIEW: "book:view",
} as const;

export type AppPermission = (typeof AppPermission)[keyof typeof AppPermission];

export const ROLE_PERMISSIONS: Record<AppRole, readonly AppPermission[]> = {
    [AppRole.ADMINISTRATORS]: [AppPermission.ALL],
};