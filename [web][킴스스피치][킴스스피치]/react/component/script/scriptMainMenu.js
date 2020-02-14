import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Link } from 'react-router-dom';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    cursor: 'pointer'
  },
  menuItem: {
    fontSize: '1rem',
  }
}));
const ScriptMainMenu = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
  return (
    <div className={classes.root}>
      <MoreVertIcon ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}>
        Toggle Menu Grow
      </MoreVertIcon>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <MenuItem className={classes.menuItem} onClick={handleClose} component={Link} to={`/scriptPractice?id=${props.scriptID}&lan=${props.lan}&title=${props.scriptTitle}`}>연습</MenuItem>
                  <MenuItem className={classes.menuItem} onClick={handleClose} component={Link} to={`/scriptPresentation?id=${props.scriptID}&lan=${props.lan}&title=${props.scriptTitle}`}>실전</MenuItem>
                  <MenuItem className={classes.menuItem} onClick={handleClose} component={Link} to={`/scriptAnalysis?id=${props.scriptID}&lan=${props.lan}&title=${props.scriptTitle}`}>분석</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
export default ScriptMainMenu