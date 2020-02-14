import React, { useState } from 'react';
import { Typography, ListItem, Collapse, List } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const Panel = props => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  console.log(props);

  return (
    <>
      <ListItem onClick={handleClick} style={{ paddingBottom: '24px' }}>
        <Typography
          variant="h6"
          style={{
            position: 'absolute',
            left: '4px',
            top: '12px',
            marginLeft: '12px',
          }}
        >
          {props.item.place_origin}
        </Typography>
        <Typography
          style={{
            position: 'absolute',
            right: '4px',
            top: '12px',
            marginRight: '144px',
          }}
        >
          $ {props.item.total}
        </Typography>
        <Typography
          style={{
            position: 'absolute',
            right: '4px',
            top: '12px',
            marginRight: '48px',
          }}
        >
          {/* {props.item.date.split('T')[0].split('0-')[1]} */}
        </Typography>
        {props.item.expenditure_set.length === 0 ? null : (
          <AddIcon
            style={{
              position: 'absolute',
              right: '4px',
              top: '12px',
              marginRight: '12px',
            }}
          />
        )}
      </ListItem>

      <Collapse in={open}>
        {props.item.expenditure_set.map(item => (
          <List component="div">
            <ListItem style={{ marginBottom: '8px' }}>
              <Typography
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '12px',
                  marginLeft: '24px',
                }}
              >
                {item.item_trans}
              </Typography>
              <Typography
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '12px',
                  marginRight: '144px',
                }}
              >
                $ {item.price}
              </Typography>
            </ListItem>
          </List>
        ))}
      </Collapse>
    </>
  );
};

export default Panel;
