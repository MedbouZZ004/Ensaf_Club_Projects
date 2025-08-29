import { create } from "zustand";
import { toast } from "react-toastify";
const useAuthStore = create((set) => ({
    
    login:async (formData)=>{
        try{
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(!data.success){
                toast.error(data.message);
                return {success:data.success,message:data.message}
            }
            toast.success("Login successful");
            localStorage.setItem("admin", JSON.stringify(data.user));
            setTimeout(()=>{
                window.location.href = '/';
            },1500)
            return {success:data.success,message:'Login Successful'}

        }catch(err){
            console.error("Login error:", err);
            toast.error("An error occurred during login");
            return {success:false,message:err.message}
        } 
    },
    logout:async()=>{
        try {
            const res = await fetch("/api/admin/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (!data.success) {
                toast.error(data.message);
                return { success: data.success, message: data.message };
            }
            toast.success("Logout successful");
            localStorage.removeItem('admin');
            localStorage.removeItem("admin");
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            return { success: data.success, message: 'Logout Successful' };
        } catch (err) {
            console.error("Logout error:", err);
            toast.error("An error occurred during logout");
            return { success: false, message: err.message };
        }
    }
}))

export default useAuthStore