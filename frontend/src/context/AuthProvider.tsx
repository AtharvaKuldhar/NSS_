// 'use client'
// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode"
// import { toast } from "sonner";
// import { getTokenFromCookies, decodeUserFromToken } from "@/lib/api";

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [user, setUser] = useState<jwtPayload | null>(null);
//     const [loading, setLoading] = useState(true);

//     // Initialize user from token on mount
//     useEffect(() => {
//         const initializeAuth = () => {
//             try {
//                 const token = getTokenFromCookies();
//                 if (token) {
//                     const decodedUser = decodeUserFromToken(token);
//                     if (decodedUser) {
//                         setUser(decodedUser);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error initializing auth:', error);
//                 // Clear invalid token
//                 document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//             } finally {
//                 setLoading(false);
//             }
//         };

//         initializeAuth();
//     }, []);

//     const login = (token: string) => {
//         try {
//             const decodedUser = decodeUserFromToken(token);
//             // console.log('AuthProvider: Decoded user from token:', decodedUser);
//             if (decodedUser) {
//                 setUser(decodedUser);
//                 // console.log('AuthProvider: User set successfully');
//                 return true;
//             }
//         } catch (error) {
//             console.error('Error decoding token during login:', error);
//         }
//         return false;
//     };

//     const logout = () => {
//         setUser(null);
//         // Clear the cookie
//         document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//         toast.success('Logged out successfully');
//     };

//     const value = {
//         user,
//         setUser,
//         login,
//         logout,
//         loading
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthProvider

// gemini code

'use client'
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { authAPI } from "@/lib/api"; // Assuming authAPI is exported from your api.ts

// Define the shape of your user object (decoded from the JWT)
interface UserPayload {
    // Add properties from your JWT payload, e.g.,
    // id: string;
    userType: number;
    // email: string;
    // iat: number;
    // exp: number;
}

// Define the shape of the context value
interface AuthContextType {
    user: UserPayload | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserPayload | null>(null);
    const [loading, setLoading] = useState(true); // Keep track of initial auth check

    // This effect runs once on mount to check if there's an existing session
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                // The /auth/me route is protected. If the cookie exists and is valid,
                // this call will succeed and return the user data.
                const data = await authAPI.getCurrentUser();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                // This is expected if the user is not logged in.
                // The interceptor in api.ts will catch 401s, but we can safely ignore errors here.
                console.log("No active session found.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserSession();
    }, []);

    // The new login function
    const login = async (email: string, password: string) => {
        // The `authAPI.login` call will have the cookie set by the browser on success.
        await authAPI.login(email, password);
        
        // After the cookie is set, fetch the user's data to update the context.
        const data = await authAPI.getCurrentUser();
        if (data && data.user) {
            setUser(data.user);
            toast.success("Login successful!");
        } else {
            // This case should ideally not be reached if login succeeds
            throw new Error("Failed to fetch user data after login.");
        }
    };

    // The new logout function
    const logout = async () => {
        try {
            await authAPI.logout(); // Call the backend to clear the cookie
        } catch (error) {
            console.error("Logout failed on the server, clearing client-side state anyway.", error);
        } finally {
            setUser(null); // Clear user state regardless
            toast.success("Logged out successfully");
            // You might want to redirect the user here
            // window.location.href = '/auth/login';
        }
    };

    const value = {
        user,
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

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
