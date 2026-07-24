export const AppRole = {
    ADMINISTRATORS: "ADMINISTRATORS",
    STORE_MANAGER: "STORE_MANAGER",
    CONTENT_EDITOR: "CONTENT_EDITOR",
} as const;

export type AppRole = (typeof AppRole)[keyof typeof AppRole];

export const API_ROLE_MAP: Record<string, AppRole> = {
    Administrator: AppRole.ADMINISTRATORS,
    ADMINISTRATORS: AppRole.ADMINISTRATORS,
    STORE_MANAGER: AppRole.STORE_MANAGER,
    CONTENT_EDITOR: AppRole.CONTENT_EDITOR,
    admin: AppRole.ADMINISTRATORS,
    user: AppRole.STORE_MANAGER,
};

export const mapApiRoles = (roles: string[] = []): AppRole[] =>
    roles
        .map((role) => API_ROLE_MAP[role])
        .filter((role): role is AppRole => role !== undefined);

export const AppPermission = {
    ALL: "*",
    DASHBOARD_VIEW: "dashboard:view",
    BOOK_VIEW: "book:view",
    BOOK_CREATE: "book:create",
    BOOK_UPDATE: "book:update",
    BOOK_DELETE: "book:delete",
    CATEGORY_VIEW: "category:view",
    CATEGORY_CREATE: "category:create",
    CATEGORY_UPDATE: "category:update",
    CATEGORY_DELETE: "category:delete",
    ORDER_VIEW: "order:view",
    ORDER_UPDATE: "order:update",
    ORDER_DELETE: "order:delete",
    USER_VIEW: "user:view",
    USER_CREATE: "user:create",
    USER_UPDATE: "user:update",
    USER_DELETE: "user:delete",
} as const;

export type AppPermission = (typeof AppPermission)[keyof typeof AppPermission];

export const ROLE_PERMISSIONS: Record<AppRole, readonly AppPermission[]> = {
    [AppRole.ADMINISTRATORS]: [AppPermission.ALL],
    [AppRole.STORE_MANAGER]: [
        AppPermission.DASHBOARD_VIEW,
        AppPermission.BOOK_VIEW,
        AppPermission.BOOK_CREATE,
        AppPermission.BOOK_UPDATE,
        AppPermission.BOOK_DELETE,
        AppPermission.CATEGORY_VIEW,
        AppPermission.CATEGORY_CREATE,
        AppPermission.CATEGORY_UPDATE,
        AppPermission.CATEGORY_DELETE,
        AppPermission.ORDER_VIEW,
        AppPermission.ORDER_UPDATE,
    ],
    [AppRole.CONTENT_EDITOR]: [
        AppPermission.BOOK_VIEW,
        AppPermission.BOOK_CREATE,
        AppPermission.BOOK_UPDATE,
        AppPermission.CATEGORY_VIEW,
        AppPermission.CATEGORY_CREATE,
        AppPermission.CATEGORY_UPDATE,
    ],
};