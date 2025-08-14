// 'use client'
// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode"
// import { toast } from "sonner";
// import { authAPI } from "@/lib/api";
// // import { getTokenFromCookies, decodeUserFromToken } from "@/lib/api";

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [user, setUser] = useState<jwtPayload | null>(null);
//     const [loading, setLoading] = useState(true);

//     // Initialize user from token on mount
//     useEffect(() => {
//         const initializeAuth = async () => {
//             try {
//                 const currentUser = await authAPI.getCurrentUser();
//                 if (currentUser?.success) {
//                     setUser(currentUser.user); // backend should send { user: { id, role, name, ... } }
//                 }
//             } catch (error) {
//                 console.error('Error fetching current user:', error);
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

'use client';
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null); // can define a proper type
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        if (currentUser?.role) {
          setUser(currentUser); // backend should send { user: { id, role, name, ... } }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    return true;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
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

export default AuthProvider;

