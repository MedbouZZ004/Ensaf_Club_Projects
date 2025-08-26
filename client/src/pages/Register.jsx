import React from 'react'
import { Link } from 'react-router-dom'
import { majors } from '../utils'
import useAuthStore from '../store/useAuthStore'
import { useActionState } from 'react'
const Register = () => {
  const {register} = useAuthStore();
  const [state, formAction, isPending] = useActionState(handleSubmit, { success: null, message: '' });  
  async function handleSubmit(prevState, formData) {
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');
    const major = formData.get('major');
    const confirmPassword = formData.get('confirmPassword');
    

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    const dataToSend = {
      fullName,
      email,
      major,
      password
    };

    const result = await register(dataToSend);
    if (!result?.ok) {
      return { success: false, message: result?.message || 'Registration failed' };
    }
    return { success: true, message: result.message || 'Registration successful' };
  }
  return (
    <div className="relative h-screen items-center px-4 sm:px-8 flex ">

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-orange-300/30 bg-neutral-800/80 backdrop-blur-md overflow-hidden shadow-xs shadow-orange-200/10">
        <div className="px-6 sm:px-8 py-8">
          <h1 className="font-roboto font-bold text-3xl text-[#ffd591]">Register</h1>
          <p className="mt-1 text-neutral-300/90">Please fill in the details below to create an account.</p>

          <form 
          action={formAction}
          className="mt-6 flex flex-col items-center space-y-5 w-full" >
            <div className='flex w-full items-center gap-4'>
              <div className='w-1/2'>
                <label htmlFor="fullName" className="block text-sm text-orange-200/90 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Enter your full name"
                  className="w-full bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60"
                />
              </div>

              <div className='w-1/2'>
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
            </div>

            <div className='flex w-full items-center gap-4'>
              <div className='w-1/2'>
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

              <div className='w-1/2'>
                <label htmlFor="confirmPassword" className="block text-sm text-orange-200/90 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="Confirm your password"
                  className="w-full bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60"
                />
              </div>
            </div>
            <div className='w-full'>
              <label htmlFor="major" className="block text-sm text-orange-200/90 mb-1">
                Select your major
              </label>
              <select name="major" id="major" required defaultValue="" className="w-full bg-neutral-800/60 border border-orange-300/40 text-orange-50 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60">
                <option value="" disabled hidden>Select your major</option>
                {majors.map((major) => (
                  <option
                    key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
              
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
            >
              {isPending ? "Loading..." : "Register"}
            </button>
            <p className='text-sm text-center flex items-center gap-2 text-white/80'>
              Already have an account?
              <Link to="/login" className='text-sm text-center   underline text-[#ffd591] hover:text-orange-200 transition'>
              Login
            </Link>
            </p>
          </form>
        </div>

        <div className="relative hidden md:block">
          <img className="h-full w-full object-cover" src="/ensaf_image.jpeg" alt="ENSAF campus" loading="lazy" />
          <div aria-hidden className="absolute inset-0 bg-black/40 bg-gradient-to-t via-transparent to-transparent" />
          <div className="absolute px-8 flex-col top-50 flex justify-center items-center w-full">
            <h3 className="font-roboto text-orange-200 text-2xl rounded-sm w-[90%] font-bold text-center">
              Create your account to join the ENSAF Clubs community
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register