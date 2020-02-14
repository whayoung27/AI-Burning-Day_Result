import React from 'react';
import FetchHandler from './FetchHanlder';
import { ErrorHandler } from './ErrorHandler';

const Template = props => {
  const { children } = props;

  return (
    <>
      {children}
      <ErrorHandler />
      <FetchHandler />
    </>
  );
};

export default Template;
