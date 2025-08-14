// 'use client'
// import * as z from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useRouter } from "next/navigation"
// import signInSchema from "@/schemas/signInSchema"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import Link from "next/link"
// import { useAuth } from "@/hooks/useAuth"
// import { authAPI } from "@/lib/api"

// const SignIn = () => {
//   const router = useRouter()
//   const { login } = useAuth()
  
//   const form = useForm<z.infer<typeof signInSchema>>({
//     resolver: zodResolver(signInSchema),
//     defaultValues: {
//       email: "",
//       password: ""
//     }
//   })

//   const onSubmit = async (data: z.infer<typeof signInSchema>) => {
//     try {
//       const response = await authAPI.login(data.email, data.password)
      
//       if (response.success) {
//         toast.success("Successfully logged in", {
//           description: response.message[0]
//         })
        
//         // Get token from cookies and decode user
//         // console.log("All cookies:", document.cookie)
//         const token = document.cookie
//           .split('; ')
//           .find((row) => row.startsWith('access_token='))
//           ?.split('=')[1]
        
//         // console.log("Token found:", token ? "Yes" : "No")
//         // console.log("Token value:", token ? token.substring(0, 20) + "..." : "None")
        
//         if (!token) {
//           toast.error("Authentication failed", {
//             description: "Token not found"
//           })
//           return
//         }
        
//         // Login user in context
//         const loginSuccess = login(token)
//         // console.log("Login success:", loginSuccess)
        
//         if (!loginSuccess) {
//           toast.error("Authentication failed", {
//             description: "Invalid token"
//           })
//           return
//         }
        
//         // Decode token and redirect
//         try {
//           const decodedUser = JSON.parse(atob(token.split('.')[1]))
//           // console.log("Decoded user:", decodedUser)
          
//           const redirectPath = decodedUser.userType === 0 ? "/admin/donations" : "/volunteer/donate"
//           // console.log("Redirecting to:", redirectPath)
          
//           // Use push instead of replace for better navigation
//           router.push(redirectPath)
          
//           // Fallback redirect after a short delay
//           setTimeout(() => {
//             if (window.location.pathname === '/auth/login') {
//               // console.log("Fallback redirect triggered")
//               window.location.href = redirectPath
//             }
//           }, 1000)
//         } catch (decodeError) {
//           console.error("Token decode error:", decodeError)
//           toast.error("Authentication failed", {
//             description: "Invalid token format"
//           })
//         }
//       } else {
//         toast.error("Login failed", {
//           description: response.message[0]
//         })
//       }
//     } catch (error: any) {
//       console.error("Error in signin of user", error)
//       let errorMessage = "An unexpected error occurred"
      
//       if (error.response?.data?.message) {
//         errorMessage = Array.isArray(error.response.data.message) 
//           ? error.response.data.message[0] 
//           : error.response.data.message
//       } else if (error.message) {
//         errorMessage = error.message
//       }
      
//       toast.error("Sign in failed", {
//         description: errorMessage
//       })
//     }
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: "url('/bg.jpg')" }}>
//              <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
//         <div className="text-center ">
//           <div className="flex justify-center">
//             <img src="/nsslogo.jpeg" alt="Logo" className="h-25 w-25 rounded-full shadow-md" />
//           </div>
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Join NSS Food Connect
//           </h1>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               name="email"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="atharva@gmail.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="password"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input type="password" placeholder="password" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="flex justify-center">
//               <Button type="submit" className="px-8">Sign In</Button>
//             </div>
//           </form>
//         </Form>
//                  <div className="text-center mt-4">
//            <p>
//              Not registered? {' '}
//              <Link href="/auth/register" className="text-blue-600 hover:text-blue-800">
//                Sign up
//              </Link>
//            </p>
//          </div>
//        </div>
//     </div>
//   )
// }

// export default SignIn 
// 
// design changes-------------------------------------------------------------------------


'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import signInSchema from "@/schemas/signInSchema"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { authAPI } from "@/lib/api"

// All of your existing logic remains untouched
const SignIn = () => {
  const router = useRouter()
  const { login } = useAuth()
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  function getAccessToken() {
    console.log(document);
     
    const cookie = document.cookie
        .split(';')
        .find((row) => row.trim().startsWith('access_token='));
        
    if (!cookie) return null; // No token found
    console.log(document.cookie);
    
    return decodeURIComponent(cookie.split('=')[1]);
  }
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await authAPI.login(data.email, data.password)
      
      if (response.success) {
        toast.success("Successfully logged in", {
          description: response.message[0],
          richColors: true
        })
        
        // const token = document.cookie
        //   .split('; ')
        //   .find((row) => row.startsWith('access_token='))
        //   ?.split('=')[1]

        const token = getAccessToken();
        console.log(token);
        
        if (!token) {
          toast.error("Authentication failed", {
            description: "Token not found",
            richColors: true
          })
          return
        }
        
        const loginSuccess = login(token)
        
        if (!loginSuccess) {
          toast.error("Authentication failed", {
            description: "Invalid token",
            richColors: true
          })
          return
        }
        
        try {
          const decodedUser = JSON.parse(atob(token.split('.')[1]))
          
          const redirectPath = decodedUser.userType === 0 ? "/admin/donations" : "/volunteer/donate"
          
          router.push(redirectPath)
          
          setTimeout(() => {
            if (window.location.pathname === '/auth/login') {
              window.location.href = redirectPath
            }
          }, 1000)
        } catch (decodeError) {
          console.error("Token decode error:", decodeError)
          toast.error("Authentication failed", {
            description: "Invalid token format",
            richColors: true
          })
        }
      } else {
        toast.error("Login failed", {
          description: response.message[0],
          richColors: true
        })
      }
    } catch (error: any) {
      console.error("Error in signin of user", error)
      let errorMessage = "An unexpected error occurred"
      
      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message) 
          ? error.response.data.message[0] 
          : error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error("Sign in failed", {
        description: errorMessage,
        richColors: true
      })
    }
  }

  // START OF VISUAL REDESIGN
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-[#2C3E50]/90 to-white p-4">
      <div className="w-full max-w-4xl mx-auto flex rounded-2xl shadow-lg overflow-hidden bg-white">
        
        {/* Left Panel: Image and Tagline */}
        <div 
          className="w-1/2 bg-cover bg-center hidden md:block bg-[url('/pict.jpg')]"
        >
          <div className="p-12 text-white bg-opacity-100 h-full flex flex-col justify-end">
            <h2 className="text-4xl font-bold leading-tight">Share a Meal,</h2>
            <p className="text-xl mt-2">Share a Hope.</p>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          
          <div className="text-center mb-8">
            <img src="/nsslogo.jpeg" alt="Logo" className="h-40 w-40 mx-auto rounded-full shadow-md mb-4" />
            <h1 className="text-3xl font-bold text-[#333333]">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2">Please sign in to continue.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#333333]">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} className="bg-[#FDFDFD] border-[#EAEAEA]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#333333]">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-[#FDFDFD] border-[#EAEAEA]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* UPDATED BUTTON: The button now uses our new primary green color */}
              <Button type="submit" className="w-full text-white font-bold bg-[#000000] hover:bg-[#024B05] py-6 text-md">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Not registered yet?{' '}
              {/* UPDATED LINK: The link also uses the new green color for consistency */}
              <Link href="/auth/register" className="font-semibold text-[#000000] hover:text-[#024B05]">
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
  // END OF VISUAL REDESIGN
}

export default SignIn



