import { useState, useEffect } from 'react';

const defaultOption = {
  root: null,
  rootMargin: '1px',
  threshold: 1,
};

export const useInfiniteScroll = (callback: () => {}, option = defaultOption) => {
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (ref) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      }, option);
      observer.observe(ref);
    }

    return () => {
      observer && observer.disconnect();
    };
  }, [ref, option, callback]);

  return setRef;
};
