import React from 'react'
import { IoEyeOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const ClubCard = ({ club }) => {
    const navigate = useNavigate();
    const primaryTag = club.category?.[0] || club.categories?.[0] || 'Club';
    return (
        <div className='h-full group rounded-2xl border border-white/10 bg-neutral-800/40 backdrop-blur-sm p-4 flex flex-col gap-4 hover:border-orange-300/40 transition-colors'>
            {/* Header */}
            <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Link to={`/club/${club.club_id}`} className='relative'>
                        <img className='w-14 h-14 rounded-full ring-2 ring-orange-300/50 bg-neutral-700 object-cover' src={club.logo} alt={`${club.name} logo`} />
                    </Link>
                    <div className='flex flex-col'>
                        <Link to={`/club/${club.club_id}`} className='font-roboto font-semibold text-[17px] text-white'>{club.name}</Link>
                        <div className='flex items-center gap-2 mt-1'>
                            <span className='px-2 py-0.5 rounded-full text-xs bg-orange-300/15 text-orange-200 border border-orange-300/30'>
                                {primaryTag}
                            </span>
                            {club.category?.slice(1, 3)?.map((c, i) => (
                                <span key={i} className='px-2 py-0.5 rounded-full text-xs bg-white/5 text-neutral-300 border border-white/10'>
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-2 text-neutral-300'>
                    <IoEyeOutline className='text-orange-200/90' />
                    <span className='text-sm'>{club.views ?? 0}</span>
                </div>
            </div>

            {/* Description */}
            <div className='relative flex-1'>
                <p className='text-sm leading-relaxed text-neutral-300 pr-1 max-h-28 overflow-hidden'>
                    {club.description}
                </p>
                {/* bottom fade */}
                <div className='pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-neutral-800/60 to-transparent' />
            </div>

            {/* Footer */}
            <div className='mt-auto flex items-center justify-between'>
                <div className='flex items-center gap-2 text-neutral-300'>
                    <button type='button' className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'>
                        <FaRegHeart className='text-orange-200/90' />
                        <span className='text-xs'>{club.likes ?? 0}</span>
                    </button>
                </div>
                <button
                    type='button'
                    onClick={() => navigate(`/club/${club.club_id}`)}
                    className='px-3 py-1.5 rounded-lg bg-orange-300 text-neutral-700 cursor-pointer font-medium text-sm shadow hover:bg-orange-200 active:scale-95 transition'
                >
                    Details
                </button>
            </div>
        </div>
    )
}

export default ClubCard