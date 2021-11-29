import React from 'react';
import { String } from 'lodash';
import config from '../config.host.json';
import { RouteComponentProps } from 'react-router';

const apiFetch = async (apiQuery: string) => {
  const result = await fetch(`${config.localhost}/api/${apiQuery}`, {
    credentials: 'include',
  });
  const res = await result.json();
  return res.list;
};

const fadeOut = (targetDomElement: HTMLElement) => {
  if (targetDomElement) {
    targetDomElement.style.opacity = '1';
    setTimeout(() => {
      if (targetDomElement) targetDomElement.style.opacity = '0';
    }, 3000);
  }
};

export { apiFetch, fadeOut };
