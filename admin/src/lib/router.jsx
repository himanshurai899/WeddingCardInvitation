// Stand-ins for next/link and next/navigation, so the pages ported from Vivah run unchanged under react-router
import { Link as RouterLink, useLocation, useNavigate, useSearchParams as useRouterSearchParams } from 'react-router-dom';

const Link = ({ href, ...props }) => <RouterLink to={href} {...props} />;

export { Link };
export default Link;

export const usePathname = () => useLocation().pathname;

export const useSearchParams = () => useRouterSearchParams()[0];

export function useRouter() {
  const navigate = useNavigate();
  return { push: (to) => navigate(to), replace: (to) => navigate(to, { replace: true }) };
}
