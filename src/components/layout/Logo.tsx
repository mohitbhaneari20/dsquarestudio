import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { HeaderLogo } from '../brand/Brand';

/** Header brand lockup (updated logo file), linking home. Inherits text colour. */
export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="inline-flex items-center transition-opacity hover:opacity-70" aria-label={`${site.name} — home`}>
      <HeaderLogo title={null} className="h-7 w-auto md:h-8" />
    </Link>
  );
}
