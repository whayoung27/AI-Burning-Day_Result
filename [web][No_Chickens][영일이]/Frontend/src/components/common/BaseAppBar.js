import React from 'react';
import styled from 'styled-components';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Grid,
} from '@material-ui/core';

const CenterGrid = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAppBar = styled(({ ...other }) => <AppBar {...other} />)`
  & .MuiTypography-h6 {
    flex-grow: 1;
    text-align: center;
  }
`;

const ItemContainer = ({ type, icon, text, onClick }) => {
  return (
    <>
      {icon && type === 'icon' && (
        <IconButton color="inherit" onClick={onClick}>
          {icon}
        </IconButton>
      )}
      {!icon && (text || type === 'text') && (
        <Button color="inherit" onClick={onClick}>
          <Typography variant="subtitle1">{text}</Typography>
        </Button>
      )}
    </>
  );
};

const BaseAppBar = ({
  text,
  align = 'center',
  leftIcon,
  leftText,
  leftType = 'text',
  leftClick,
  rightIcon,
  rightText,
  rightType = 'text',
  rightClick,
}) => {
  return (
    <StyledAppBar
      color="inherit"
      elevation={0}
      position="sticky"
      style={{
        background: 'linear-gradient(to bottom, #4ac8d9, #4fdbc2)',
      }}
    >
      <Toolbar disableGutters={true}>
        <CenterGrid item xs={2}>
          <ItemContainer
            type={leftType}
            icon={leftIcon}
            text={leftText}
            onClick={leftClick}
          />
        </CenterGrid>
        <Grid item xs={8}>
          <Typography variant="h6" align={align} style={{ color: '#f2f5f8' }}>
            {text}
          </Typography>
        </Grid>
        <CenterGrid item xs={2}>
          <ItemContainer
            type={rightType}
            icon={rightIcon}
            text={rightText}
            onClick={rightClick}
          />
        </CenterGrid>
      </Toolbar>
    </StyledAppBar>
  );
};

export default BaseAppBar;
