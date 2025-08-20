import React from 'react'

const ForgotPassword = () => {
  return (
    <div className='h-screen flex items-center justify-center px-10 py-10'>
        <form className='form'>
    
            <label htmlFor="">Enter your email</label>
            <input className='input' type="email" placeholder='' />
            <button type="submit" className='button'>Submit</button>   
    

        </form>
    </div>
  
  )
}

export default ForgotPassword