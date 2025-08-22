import React from 'react'
import { motion } from 'framer-motion'
const MotionDiv = motion.div
import Titre from './Titre'

const ClubIntro = ({ clubName, clubDescription, club_video, createdDate }) => {
  const dateStr = createdDate ? new Date(createdDate).toLocaleDateString() : ''

  return (
    <section className="relative w-full px-4 sm:px-8 lg:px-12 py-10 text-white">
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 w-[50vw] max-w-[340px] h-[50vw] max-h-[340px] rounded-full bg-orange-200/20 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-10 w-[50vw] max-w-[340px] h-[50vw] max-h-[340px] rounded-full bg-orange-200/20 blur-[140px]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* description */}
        <MotionDiv
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
                <Titre clubName={clubName} />

                <span className="inline-flex items-center gap-2 self-start rounded-full border border-amber-200/40 bg-amber-300/15 px-3 py-1 text-sm text-amber-100 shadow-sm">
                  <span aria-hidden>📅</span>
                  <span>Created on:</span>
                  <strong className="text-amber-50">{dateStr}</strong>
                </span>

                <p className="text-neutral-300/95 leading-relaxed max-w-prose">
                  {clubDescription}
                </p>
        </MotionDiv>

              {/* video */}
        <MotionDiv
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
                className="relative rounded-2xl border border-orange-300/30 bg-neutral-800/60 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden"
              >
                <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-orange-300/20" />

                <div className="relative aspect-video w-full">
                  <video
                    src={club_video}
                    controls
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
        </MotionDiv>
      </div>
    </section>
  )
}

export default ClubIntro