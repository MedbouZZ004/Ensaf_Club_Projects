import React, { useEffect, useMemo, useState } from 'react';
import { MdDateRange } from "react-icons/md";

const ActivityCard = ({ activity }) => {
    const [selectedImage, setSelectedImage] = useState(activity?.activity_images?.[0])

    useEffect(() => {
        setSelectedImage(activity?.activity_images?.[0])
    }, [activity])

    const dateLabel = useMemo(() => {
        if (!activity?.activity_date) return ''
        const d = new Date(activity.activity_date)
        return isNaN(d) ? activity.activity_date : d.toLocaleDateString()
    }, [activity?.activity_date])

    return (
        <article className='w-full text-white rounded-2xl border border-orange-300/25 bg-neutral-800/60 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-5'>
                {/* gallery */}
                <div className='flex flex-col gap-3'>
                    <div className='relative w-full rounded-xl overflow-hidden border border-orange-300/20'>
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={activity?.name || 'Activity image'}
                                className='w-full h-64 sm:h-72 object-cover transition-transform duration-500 ease-out hover:scale-[1.02]'
                            />
                        ) : (
                            <div className='w-full h-64 sm:h-72 grid place-items-center bg-neutral-700/40 text-orange-200'>No Image</div>
                        )}
                        <div aria-hidden className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent' />
                    </div>

                    {activity?.activity_images?.length > 1 && (
                        <div className='flex gap-2 overflow-x-auto pr-1'>
                            {activity.activity_images.map((image, index) => (
                                <button
                                    type='button'
                                    key={`${image}-${index}`}
                                    onClick={() => setSelectedImage(image)}
                                    className={`shrink-0 rounded-md overflow-hidden border ${
                                        selectedImage === image
                                            ? 'border-orange-300 ring-1 ring-orange-300/60'
                                            : 'border-orange-300/20 hover:border-orange-300/40'
                                    }`}
                                    aria-label={`Select image ${index + 1}`}
                                >
                                    <img src={image} alt='' className='w-16 h-16 object-cover' />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* details */}
                <div className='flex flex-col gap-3 lg:pl-2'>
                    <h3 className='font-roboto font-bold text-2xl text-primary'>{activity?.name}</h3>
                    {dateLabel && (
                        <span className='self-start inline-flex items-center gap-2 rounded-full border border-amber-200/35 bg-amber-300/10 px-3 py-1 text-sm text-amber-100'>
                            <MdDateRange className='w-4 h-4' />
                            {dateLabel}
                        </span>
                    )}
                    <p className='text-neutral-300/95 leading-relaxed'>{activity?.pitch}</p>
                </div>
            </div>
        </article>
    )
}

export default ActivityCard