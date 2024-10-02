// import { useSession } from "next-auth/react";
// import { getServerSession } from "next-auth/next";
// import { redirect } from "next/navigation";
// import toast from "react-hot-toast";

// export default async function Layout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const session: {
//     user: { name: string; email: string; image: string };
//   } | null = await getServerSession();

//   if (!session) {
//     redirect("/");
//   }

//   let email: string = await session?.user?.email;
//   console.log( email);
//   const res = await fetch(`http://localhost:3000/api/users/email/${email}`);
//   const data = await res.json();
//   console.log(data);
//   // redirecting user to the home page if not admin
//   if (data.role === "user") {
//     redirect("/");
//   }

//   return <>{children}</>;
// }

 import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
interface User {
  name: string;
  email: string;
  image: string;
}

interface Session {
  user: User;
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  const session: Session | null = await getServerSession();
// console.log(session);
   if (!session) {
    redirect("/");
    return null;  
  }

  const email = session.user.email;  
  // console.log(email);

  try {
    // const res = await fetch(`http://localhost:3000/api/users/email/${email}`);
    const res = await fetch(`${process.env.WEBSITE_URL}/api/users/${email}`);
     if (!res.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await res.json();
  //  console.log(data);
    // Redirecting user to the home page if not admin
    if (data.role === "user") {
      redirect("/");
      return null; // Ensure the function exits after redirect
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    // toast.error("An error occurred while fetching user data.");
    redirect("/");
    return null; // Ensure the function exits after redirect
  }

  return <>{children}</>;
}
