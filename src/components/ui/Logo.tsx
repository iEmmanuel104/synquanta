interface LogoProps {
  variant?: 'primary' | 'white';
  className?: string;
}

export const Logo = ({ variant = 'primary', className = '' }: LogoProps) => {
  const logoSrc =
    variant === 'white'
      ? '/brandassets/synquanta-logo-white.svg'
      : '/brandassets/synquanta-logo-primary.svg';

  return (
    <a href="/" className={`block ${className}`} aria-label="SynQuanta Technologies - Home">
      <img
        src={logoSrc}
        alt="SynQuanta Technologies"
        className="h-10 md:h-12 w-auto"
        width="200"
        height="48"
      />
    </a>
  );
};
