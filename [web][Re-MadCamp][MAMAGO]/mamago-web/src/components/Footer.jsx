import React, { useState } from 'react';
import styled from 'styled-components';

const StyledFooter = styled.div`
  height: 40px;
  padding: 5px;
  min-width: 120px;
  color: white;
  font-weight: 600;
  background-color: ${props => (props.danger ? 'red' : 'purple')};
`;

const Footer = props => {
  const { children } = props;

  return <StyledFooter>{children}</StyledFooter>;
};

export default Footer;
