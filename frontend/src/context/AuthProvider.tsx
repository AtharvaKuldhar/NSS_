'use client'
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner";
import { getTokenFromCookies, decodeUserFromToken } from "@/lib/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<jwtPayload | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize user from token on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const token = getTokenFromCookies();
                if (token) {
                    const decodedUser = decodeUserFromToken(token);
                    if (decodedUser) {
                        setUser(decodedUser);
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid token
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (token: string) => {
        try {
            const decodedUser = decodeUserFromToken(token);
            // console.log('AuthProvider: Decoded user from token:', decodedUser);
            if (decodedUser) {
                setUser(decodedUser);
                // console.log('AuthProvider: User set successfully');
                return true;
            }
        } catch (error) {
            console.error('Error decoding token during login:', error);
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        // Clear the cookie
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        setUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider


