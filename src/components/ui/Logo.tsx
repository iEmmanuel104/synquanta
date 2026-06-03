interface LogoProps {
  variant?: 'primary' | 'white';
  className?: string;
}

/**
 * SynQuanta lockup — the animated Orbit Atom mark + wordmark. The mark is a
 * self-animating SVG (electron orbits, nucleus pulses; reduced-motion safe) so
 * it plays inside <img>. Header/Footer wrap this in a router <Link>.
 */
export const Logo = ({ variant = 'primary', className = '' }: LogoProps) => {
  const white = variant === 'white';
  const mark = white
    ? '/brand-kit/orbit-atom-animated-white.svg'
    : '/brand-kit/orbit-atom-animated.svg';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={mark}
        alt=""
        aria-hidden="true"
        className="h-9 w-9 md:h-10 md:w-10 flex-none"
        width="40"
        height="40"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[19px] md:text-[21px] tracking-[-0.02em]">
          <span className={`font-semibold ${white ? 'text-white' : 'text-forest-deep'}`}>Syn</span>
          <span className={white ? 'text-[#E8F0EB]' : 'text-forest-primary'}>Quanta</span>
        </span>
        <span
          className={`mt-1 text-[8px] md:text-[9px] font-semibold tracking-[0.28em] ${
            white ? 'text-[#95A097]' : 'text-neutral-medium-gray'
          }`}
        >
          TECHNOLOGIES
        </span>
      </span>
    </span>
  );
};
