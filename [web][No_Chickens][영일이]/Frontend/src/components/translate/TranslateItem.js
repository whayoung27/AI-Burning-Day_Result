import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const TranslateItem = props => {
  const [isAlive, setIsAlive] = useState(true);

  return (
    <>
      {isAlive && (
        <Grid
          containter
          direction="row"
          justify="space-around"
          alignItems="center"
          style={{ display: 'flex', width: 'inherit' }}
        >
          <Grid item style={{ display: 'inline-block' }}>
            <TextField id="standard-basic" label="상품명" value={props.ko} />
          </Grid>
          <Grid item style={{ display: 'inline-block' }}>
            <TextField
              id="standard-basic"
              label="가격($)"
              value={props.value}
            />
          </Grid>
          <Grid
            item
            style={{ display: 'inline-block' }}
            onClick={() => {
              setIsAlive(false);
            }}
          >
            <DeleteForeverIcon />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default TranslateItem;
