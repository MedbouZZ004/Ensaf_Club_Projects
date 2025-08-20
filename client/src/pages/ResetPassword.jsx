import React from 'react'

const ResetPassword = () => {
    const onSubmit = (e) => {
        e.preventDefault();
        // TODO: hook to your reset API
    };

    return (
        <div className="relative min-h-screen flex items-center px-4 sm:px-8 py-10">
            {/* ambient glows */}
            <div aria-hidden className="pointer-events-none absolute -top-12 -left-10 w-[55vw] max-w-[320px] h-[55vw] max-h-[320px] bg-orange-200/30 rounded-full blur-[140px]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-10 w-[55vw] max-w-[320px] h-[55vw] max-h-[320px] bg-orange-200/30 rounded-full blur-[140px]" />

            <div className="w-full max-w-xl mx-auto rounded-2xl border border-orange-300/30 bg-neutral-800/80 backdrop-blur-md shadow-xs shadow-orange-200/10 overflow-hidden">
                <div className="px-6 sm:px-8 py-8">
                    <h1 className="font-roboto font-bold text-3xl text-[#ffd591]">Reset Password</h1>
                    <p className="mt-1 text-neutral-300/90">Enter the email, the reset token you received, and your new password.</p>

                    <form onSubmit={onSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm text-orange-200/90 mb-1">Email</label>
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
                            <label htmlFor="token" className="block text-sm text-orange-200/90 mb-1">Reset Token</label>
                            <input
                                type="text"
                                id="token"
                                name="token"
                                required
                                placeholder="Enter your reset token"
                                className="w-full bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm text-orange-200/90 mb-1">New Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="Enter your new password"
                                className="w-full bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm text-orange-200/90 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                placeholder="Confirm your new password"
                                className="w-full bg-neutral-800/60 border border-orange-300/40 text-orange-50 placeholder-orange-200/70 rounded-lg px-3 py-2 outline-none transition focus:border-orange-300/80 focus:ring-1 focus:ring-orange-300/60"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-300 text-neutral-700 cursor-pointer font-medium py-2.5 rounded-lg border border-orange-300/60 shadow transition-all duration-200 hover:bg-orange-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword