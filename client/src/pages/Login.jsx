import React, { useActionState } from 'react'
import { Link } from 'react-router-dom'
import ReturnButton from '../components/ReturnButton'
import useAuthStore from '../store/useAuthStore'
import UserCard from '../components/UserCard'
const Login = () => {
  const { login } = useAuthStore();
  const [state, formAction, isPending] = useActionState(handleSubmit, { success: null, message: '' });
  async function handleSubmit(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const dataToSend = {
      email,
      password
    }
    const result = await login(dataToSend);
    if(!result.success) return {success:false, message:result.message}
    return {success:true, message:result.message}
    }
  return (
    <div className="relative h-screen items-center px-4 sm:px-8 flex ">
      <ReturnButton />
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-orange-300/30 bg-neutral-800/80 backdrop-blur-md overflow-hidden shadow-xs shadow-orange-200/10">
        <div className="px-6 sm:px-8 py-8">
          <h1 className="font-roboto font-bold text-3xl text-[#ffd591]">Login</h1>
          <p className="mt-1 text-neutral-300/90">Please enter your credentials to access your account.</p>
          <form action={formAction} className="mt-6 space-y-5 w-full" >
            <div>
              <label htmlFor="email" className="block text-sm text-orange-200/90 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-orange-200/90 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter your password"
                className="w-full bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60"
              />
            </div>

            <div className="flex items-center  justify-between">
              <Link to="/forgot-password" className="text-sm underline text-[#ffd591] hover:text-orange-200 transition" aria-label="Forgot password" title="Forgot password">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
            >
              {isPending ? "Loading..." : "Login"}
            </button>
            <p className='text-sm text-center flex items-center gap-2 text-white/80'>
              You don't have an account?
              <Link to="/register" className='text-sm text-center   underline text-[#ffd591] hover:text-orange-200 transition'>
              Create an account
            </Link>
            </p>
          </form>
        </div>

        <div className="relative hidden md:block">
          <img className="h-full w-full object-cover" src="/ensaf_image.jpeg" alt="ENSAF campus" loading="lazy" />
          <div aria-hidden className="absolute inset-0 bg-black/40 bg-gradient-to-t via-transparent to-transparent" />
          <div className="absolute px-8 flex-col top-50 flex justify-center items-center w-full">
            <h3 className="font-roboto text-orange-200 text-xl rounded-sm w-[70%] font-bold text-center">WELCOME TO ENSAF CLUBS PLATFORM</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login