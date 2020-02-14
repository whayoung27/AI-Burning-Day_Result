import React, { useState } from 'react';
import styled from 'styled-components';

const MainStyle = styled.div`
  padding-top: 4rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const Main = props => {
  const { children } = props;

  return <MainStyle>{children}</MainStyle>;
};

export default Main;
