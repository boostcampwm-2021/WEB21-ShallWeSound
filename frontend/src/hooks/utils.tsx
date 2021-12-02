import config from '../config.host.json';

const apiFetch = async (apiQuery: string) => {
  const result = await fetch(`${config.localhost}/api/${apiQuery}`, {
    credentials: 'include',
  });
  const res = await result.json();
  return res.list;
};

const fadeOut = (targetDomElement: HTMLElement) => {
  if (targetDomElement !== null) {
    targetDomElement.style.opacity = '1';
    setTimeout(() => {
      targetDomElement.style.opacity = '0';
    }, 3000);
  }
};

export { apiFetch, fadeOut };
