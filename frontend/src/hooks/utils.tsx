import React from 'react';
import { String } from 'lodash';
import config from '../config.host.json';
import { RouteComponentProps, useHistory } from 'react-router';
const listFetch = async () => {
  const result = await fetch(`${config.localhost}/api/room`, {
    credentials: 'include',
  });
  const res = await result.json();
  return res.list;
};

const fadeOut = (targetDomElement: HTMLElement) => {
  targetDomElement.style.opacity = '1';

  setTimeout(() => {
    if (targetDomElement) targetDomElement.style.opacity = '0';
  }, 3000);
};

export { listFetch, fadeOut };
