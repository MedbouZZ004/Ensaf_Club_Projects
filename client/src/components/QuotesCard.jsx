import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { FaCaretLeft, FaCaretRight, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { motivationQuotes } from '../utils';
export default function QuotesCard() {
    const quotes = useMemo(() => motivationQuotes, []);

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const goPrev = () => setIndex((i) => (i - 1 + quotes.length) % quotes.length);
    const goNext = () => setIndex((i) => (i + 1) % quotes.length);

        useEffect(() => {
            if (paused) return;
            const id = setInterval(() => {
                setIndex((i) => (i + 1) % quotes.length);
            }, 6000);
            return () => clearInterval(id);
        }, [paused, quotes.length]);

    const text = quotes[index];
    const lastDot = text.lastIndexOf('. ');
    const hasAuthor = lastDot !== -1 && lastDot < text.length - 2;
    const quoteText = hasAuthor ? text.slice(0, lastDot + 1) : text;
    const author = hasAuthor ? text.slice(lastDot + 2) : '';
    return (
        <Motion.div
            initial={{opacity:0, x:-30}}
            whileInView={{opacity:1, x:0}}
            viewport={{once:true, amount:0.25}}
            transition={{duration:0.5, ease:'easeOut'}}
            className='w-full md:w-[30%] flex flex-col gap-5 bg-orange-300 p-6 rounded-tr-4xl rounded-bl-4xl shadow-xl ring-1 ring-black/10 relative overflow-hidden'
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') goPrev();
                if (e.key === 'ArrowRight') goNext();
            }}
            aria-roledescription="carousel"
            aria-label="Inspirational quotes"
        >

            {/* Animated quote */}
            <Motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className='min-h-[120px]'
            >
                <p className='text-lg md:text-xl font-medium font-roboto text-black/80 leading-relaxed italic'>
                    {quoteText}
                </p>
                {author && (
                    <p className='mt-3 text-sm font-roboto text-black/60'>
                        — {author}
                    </p>
                )}
            </Motion.div>

            {/* Dots */}
            <div className='flex gap-1.5 w-full justify-center items-center'>
                {quotes.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Go to quote ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`h-2 rounded-full transition-all duration-200 ${i === index ? 'bg-black/70 w-8' : 'bg-black/30 w-5 hover:bg-black/50'}`}
                    />
                ))}
            </div>

            {/* Footer controls */}
            <div className='w-full flex justify-between items-center'>
                <span className='text-xs font-roboto text-black/50'>{index + 1}/{quotes.length}</span>
                <div className='flex gap-3 items-center'>
                    <button
                        className='border cursor-pointer hover:border-black/50 hover:text-black/70 transition-colors border-black/70 rounded-full w-10 h-10 flex items-center justify-center  backdrop-blur-sm'
                        onClick={goPrev}
                        aria-label='Previous quote'
                    >
                        <FaCaretLeft size={20} />
                    </button>
                    <button
                        className='border cursor-pointer hover:border-black/50 hover:text-black/70 transition-colors border-black/70 rounded-full w-10 h-10 flex items-center justify-center  backdrop-blur-sm'
                        onClick={goNext}
                        aria-label='Next quote'
                    >
                        <FaCaretRight size={20} />
                    </button>
                </div>
            </div>
        </Motion.div>

    );
}

