import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom';
const ResetPassword = () => {
    const {resetPassword} = useAuthStore();

    const [token, setToken] = useState(['', '', '', '', '', '']);
    const [activeInput, setActiveInput] = useState(0);
    const inputRefs = useRef([]);
    const [isPending, setIsPending] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (isPending) return;

        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = (formData.get('email') || '').toString().trim();
        const password = (formData.get('password') || '').toString();
        const confirmPassword = (formData.get('confirmPassword') || '').toString();
        const otp = token.join('').trim();

        // Client-side validations
        if (!email) {
            toast.error('Email is required');
            return;
        }
        if (otp.length !== 6) {
            toast.error('Please enter the 6-character reset token');
            // focus first empty token input
            const idx = token.findIndex(t => !t);
            if (idx >= 0 && inputRefs.current[idx]) setActiveInput(idx);
            return;
        }
        if (!password) {
            toast.error('Password is required');
            return;
        }
        // At least 8 chars, contains letters and numbers
        const strongEnough = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
        if (!strongEnough) {
            toast.error('Password must be at least 8 characters and contain letters and numbers');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setIsPending(true);
            const result = await resetPassword(email, otp, password);
            // The store already toasts. We can optionally clear form on success.
            if (result?.success) {
                setToken(['', '', '', '', '', '']);
                form.reset();
                setActiveInput(0);
            }
    } catch {
            // Errors already handled/toasted in the store, keep silent here
        } finally {
            setIsPending(false);
        }
    };

    const handleTokenChange = (index, value) => {
        if (/^[a-zA-Z0-9]$/.test(value) || value === '') {
            const newToken = [...token];
            newToken[index] = value.toUpperCase();
            setToken(newToken);

            // Auto-focus to next input
            if (value !== '' && index < 5) {
                setActiveInput(index + 1);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && token[index] === '' && index > 0) {
            // Move to previous input on backspace
            setActiveInput(index - 1);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        const newToken = [...token];
        
        for (let i = 0; i < pasteData.length; i++) {
            if (i < 6 && /^[a-zA-Z0-9]$/.test(pasteData[i])) {
                newToken[i] = pasteData[i].toUpperCase();
            }
        }
        
        setToken(newToken);
        setActiveInput(Math.min(pasteData.length, 5));
    };

    useEffect(() => {
        if (inputRefs.current[activeInput]) {
            inputRefs.current[activeInput].focus();
        }
    }, [activeInput]);

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 py-10">
            <div className="w-full max-w-xl mx-auto rounded-2xl border border-orange-300/30 bg-neutral-800/80 backdrop-blur-md shadow-xs shadow-orange-200/10 overflow-hidden">
                <div className="px-6 sm:px-8 py-8">
                    <div className="text-center mb-2">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-300/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="font-roboto font-bold text-3xl text-[#ffd591]">Reset Password</h1>
                        <p className="mt-2 text-neutral-300/90">Enter the email, the reset token you received, and your new password.</p>
                    </div>

                    <form onSubmit={onSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm text-orange-200/90 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-200/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="Enter your email"
                                    disabled={isPending}
                                    className="w-full pl-10 bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-orange-200/90 mb-2">Reset Token</label>
                            <div className="flex justify-between space-x-2" onPaste={handlePaste}>
                                {token.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleTokenChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onFocus={() => setActiveInput(index)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        disabled={isPending}
                                        className="w-12 h-12 bg-neutral-800/60 border-2 border-orange-300/40 text-orange-50 text-center text-xl font-bold rounded-lg outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 cube-input disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-orange-200/70 mt-2">Paste your token or type it in the cubes above</p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm text-orange-200/90 mb-2">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-200/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    placeholder="Enter your new password"
                                    disabled={isPending}
                                    className="w-full pl-10 bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm text-orange-200/90 mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-200/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    placeholder="Confirm your new password"
                                    disabled={isPending}
                                    className="w-full pl-10 bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-primary hover:bg-primary/90 disabled:hover:bg-primary disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
                        >
                            {isPending ? 'Resetting…' : 'Reset Password'}
                            {!isPending && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            )}
                        </button>
                        <p className='text-neutral-300 '>go to login page
                            <Link to="/login" className="ml-2 text-orange-200 underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .cube-input {
                    transform-style: preserve-3d;
                    transform: translateZ(0);
                    transition: all 0.3s ease;
                }
                
                .cube-input:focus {
                    transform: translateZ(8px);
                    box-shadow: 0 4px 12px rgba(255, 168, 106, 0.3);
                }
                
                .cube-input:not(:placeholder-shown) {
                    background: rgba(253, 186, 116, 0.1);
                    border-color: rgba(253, 186, 116, 0.7);
                }
            `}</style>
        </div>
    )
}

export default ResetPassword;