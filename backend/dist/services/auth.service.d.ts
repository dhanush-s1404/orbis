export interface AuthUser {
    id: string;
    name: string | null;
    email: string;
    role: "CUSTOMER" | "ADMIN" | "DEVELOPER";
}
export declare class AuthService {
    static register(name: string, email: string, password: string): Promise<{
        user: AuthUser;
        token: string;
    }>;
    static login(email: string, password: string): Promise<{
        user: AuthUser;
        token: string;
    } | null>;
    static validateToken(token: string): Promise<AuthUser | null>;
    static getProfile(userId: string): Promise<AuthUser | null>;
    static assignRole(userId: string, role: "CUSTOMER" | "ADMIN" | "DEVELOPER"): Promise<User>;
}
export default AuthService;
