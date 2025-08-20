import {create} from 'zustand';
import {toast} from 'react-toastify'
const useAuthStore = create((set)=>({
    error:null,    
    loading:false,
    login: async (formData) => {
        try {
            set({ error: null, loading: true });
            const res = await fetch('/api/auth/logIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(data.error){
                set({error: data.error, loading:false});
                toast.error(data.error);
                return { success: false, message: data.error };
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            set({error:null, loading:false});
            toast.success('Login successful');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
            return {success:true, message:"Login successful"}
        }catch(err){
            console.error("Login error", err);
            set({error: "Login failed", loading:false});
            toast.error("Login failed");
            return { success: false, message: "Login failed" };
        }   
    },
    register: async (formData)=>{
        try{
            set({ error: null, loading: true });
            const res = await fetch('/api/auth/signUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            let data = null;
            try {
                const text = await res.text();
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            if (!res.ok) {
                const msg = data?.error || `Registration failed (${res.status})`;
                set({ error: msg, loading: false });
                toast.error(msg);
                return { ok: false, message: msg };
            }

            set({ user: data.user, error: null, loading: false });
            toast.success('Registered successfully');
            return { ok: true, message: 'Registered successfully', user: data.user };
        } catch (err) {
            console.error('Registration request error:', err);
            const msg = 'Registration failed';
            set({ error: msg, loading: false });
            toast.error(msg);
            return { ok: false, message: msg };
        }

    },
    logout:async ()=>{
        try {
            const res = await fetch('/api/auth/logOut', { method: 'POST', credentials: 'include' });
            if (!res.ok) throw new Error('Failed to logout');
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
        } catch (err) {
            console.error('Logout error:', err);
            toast.error('Logout failed');
        }
    }
}))
export default useAuthStore;