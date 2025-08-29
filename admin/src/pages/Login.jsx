import React from 'react'
import { useActionState } from 'react'
import useAuthStore from '../store/useAuthStore';
import { use } from 'react';
const Login = () => {
  const [state, formAction, isPending] = useActionState(handleSubmit, {success:null, message:null});
  const {login} = useAuthStore();
  async function handleSubmit(prevState,formData){
    const email = formData.get("email");
    const password = formData.get("password");
    const data = {
        email,
        password
    }
    const result = await login(data);
    if(!result.success){
        return {success:result.success,message:result.message}
    }else{
        return {success:result.success,message:result.message}
    }
  }
  return (
    <main className='flex font-roboto items-center justify-center h-screen w-full'>
        <div className='flex flex-col p-4 w-90 rounded-lg shadow-sm shadow-gray-300 gap-5'>
            <h1 className='font-bold text-orange-400 w-full text-3xl text-center'>Login</h1>
            <form action={formAction}  className='flex flex-col gap-8'>
                <div className='flex flex-col gap-3'>
                    <label className='font-medium text-md text-gray-600' htmlFor="email">Email</label>
                    <input 
                    className="outline-none border border-orange-400/50 p-2 w-full focus:border-2 focus:border-orange-400/80 duration-50 transition-all ease-in bg-transparent rounded-lg"
                    type="email" name="email" id="email"  placeholder='Enter your email...'/>
                </div>
                <div className='flex flex-col gap-3'>
                    <label className='font-medium text-md text-gray-600' htmlFor="password">Password</label>
                    <input 
                    className='outline-none border border-orange-400/50 p-2 w-full focus:border-2  focus:border-orange-400/80 duration-50 transition-all ease-in bg-transparent rounded-lg'
                    type="password" name="password" id="password" placeholder='Enter your password...' />
                </div>
                <button className='bg-orange-400 hover:bg-orange-400/80 duration-150 ease-in transition-all text-white text-lg rounded-lg py-1 cursor-pointer'>
                    {isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    </main>
  )
}

export default Login