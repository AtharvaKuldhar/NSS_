// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { LoaderPinwheel } from "lucide-react";
// export default function Home() {
//   const router = useRouter()
//   useEffect(()=>{
//     router.push("/auth/login")
//   })
//   return (
//     <div className="w-full h-full flex justify-center items-center"><LoaderPinwheel/></div>
//   );  
// }

// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login");
}
