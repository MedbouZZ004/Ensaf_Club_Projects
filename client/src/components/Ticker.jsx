import { motion } from 'framer-motion';
import { BsStars } from "react-icons/bs";
import { providers } from '../utils';
const Ticker = () => {
    const loop = [...providers, ...providers];
    const MotionDiv = motion.div;
    return (
        <div className="relative w-full bg-neutral-700/80 mb-[1px] overflow-hidden border-t border-orange-200/50">
            {/* edge fades */}
            <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-neutral-900/60 to-transparent z-10" />
            <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-neutral-900/60 to-transparent z-10" />

            <MotionDiv
                className="flex items-center gap-10 py-3 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                role="marquee"
                aria-label="Club highlights"
            >
                {loop.map((provider, idx) => (
                    <div key={`${provider}-${idx}`} className="inline-flex items-center gap-3 text-orange-200">
                        <BsStars className="text-white" />
                        <span className="font-roboto text-sm md:text-base">{provider}</span>
                    </div>
                ))}
            </MotionDiv>
        </div>
    );
};

export default Ticker;