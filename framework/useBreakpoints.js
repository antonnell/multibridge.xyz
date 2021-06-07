import { useMediaQuery } from 'react-responsive';

const useBreakpoints = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 425px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};
export default useBreakpoints;
