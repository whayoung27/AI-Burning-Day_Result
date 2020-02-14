import React, { useState } from 'react';
import styled from 'styled-components';

// const StyledHeader = styled.div`
//   height: 40px;
//   padding: 5px;
//   min-width: 120px;
//   color: white;
//   font-weight: 600;
//   background-color: ${props => (props.danger ? 'red' : 'purple')};
// `;

const NavHeader = styled.nav`
  padding: 0.5rem 1rem !important;
  background-color: #333940;
  letter-spacing: 0.1rem;
  font-weight: bold;
  position: absolute;
  width: 100%;
  z-index: 2;
  box-sizing: border-box;
`;

const FontsHeader = styled.span`
  vertical-align: middle;
  color: white;
  text-transform: uppercase;
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  vertical-align: middle;
`;

const ButtonStyle = styled.button`
  outline-color: #d48a6e;
  float: right;
  margin-right: 0px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const ImageButton = styled.img`
  border: none;
  background-color: none;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  margin-top: 3px;
`;

const UlHeader = styled.ul`
  font-weight: bold;
  color: white;
  list-style: none;
  line-height: 1.8rem;

  li {
    font-weight: bold;
  }
`;

const SideList = () => {
  return (
    <UlHeader>
      <li>hi</li>
      <li>Hello</li>
      <li>Bye</li>
    </UlHeader>
  );
};

const Header = props => {
  const { children } = props;

  const [toggle, setToggle] = useState(false);

  const onIncrease = e => {
    e.preventDefault();
    setToggle(prev => !prev);
  };

  return (
    <>
      <NavHeader>
        <span>
          <Logo src={require('../images/mamago_logo.png')}></Logo>
          <FontsHeader>Mamago</FontsHeader>
        </span>
        <ButtonStyle type="button" onClick={onIncrease}>
          <ImageButton src={require('../icons/menu.png')} />
        </ButtonStyle>
        {toggle && <SideList />}
      </NavHeader>
      {children}
    </>
  );
};

export default Header;
