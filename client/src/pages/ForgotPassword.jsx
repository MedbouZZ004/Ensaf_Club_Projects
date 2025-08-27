import React from 'react'
import ReturnButton from '../components/ReturnButton'
import useAuthStore from '../store/useAuthStore'
import { useActionState } from 'react';

const ForgotPassword = () => {
  const {forgotPassword} = useAuthStore();
  const [state, formAction, isPending] = useActionState(handleSubmit, {success:null, message:null});

  async function handleSubmit(prevState, formData){
    const email = formData.get('email');
    const result = await forgotPassword(email);
    if(result.success){
      return {success:result.success, message: result.message}
    }else{
      return {success:result.success, message: result.message}
    }
  }
    
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <ReturnButton />
      <div className="w-full max-w-md bg-neutral-800/30 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Forgot Password</h1>
          <p className="text-neutral-300">Enter your email and we'll send you a reset link</p>
        </div>
        
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input 
                id="email"
                type="email"
                name="email" 
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/60 border border-orange-300/40 rounded-lg outline-none  text-orange-50 placeholder-orange-200/70 focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60 transition-all duration-300" 
                placeholder="Enter your email address"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
          >
            {isPending? 'sending....' : 'Send reset link'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {state.message && (state.success ? 
            <p className='text-green-500 font-roboto'>{state.message}</p>
            :
            <p className='text-red-500 font-roboto'>{state.message}</p> 
            )}
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword