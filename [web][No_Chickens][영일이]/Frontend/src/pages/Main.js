import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Main.scss';
import {
  Grid,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ReceiptIcon from '@material-ui/icons/Receipt';
import BaseAppBar from '../components/common/BaseAppBar';
import Drawar from '../components/common/Drawer';
import axios from 'axios';
import ExifOrientationImg from 'react-exif-orientation-img';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Main = () => {
  const history = useHistory();
  const [imgBase64, setImgBase64] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [country, setCounty] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const changeImgFile = file => {
    let reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) {
        setImgBase64(base64.toString());
      }
    };
    if (file) {
      reader.readAsDataURL(file);
      setImgFile(file);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChangeCountry = event => {
    setCounty(event.target.value);
  };

  const handleTranslate = () => {
    if (imgFile) {
      setOpenDialog(true);
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].replace(' ', '');
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  var csrftoken = getCookie('csrftoken');

  const getImgRequest = async () => {
    try {
      const formData = new FormData();
      formData.append('file', imgFile);
      formData.append('imgBase64', imgBase64);
      formData.append('country', country);
      return await axios.post(
        'http://10.83.32.154:3000/accounts/v1/receipt/',
        formData,
        {
          headers: {
            'X-CSRFTOKEN': csrftoken,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getImg = async () => {
    const res = await getImgRequest();
    console.log(res);
    if (country) {
      history.push({
        pathname: '/Translate',
        state: { imgBase64: imgBase64, translateData: res.data },
      });
    } else {
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <div
        style={{
          width: 'inherit',
          height: 'inherit',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BaseAppBar
          style={{ flexGrow: '0' }}
          text="영일이"
          leftType="icon"
          leftIcon={<Drawar />}
        />
        <Grid
          container
          direction="column"
          justify="space-evenly"
          style={{
            width: 'inherit',
            margin: '0px',
            flexGrow: '1',
          }}
        >
          <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={0}
              style={{
                width: '350px',
                height: '450px',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              {imgBase64 ? (
                <ExifOrientationImg
                  src={imgBase64}
                  alt="img"
                  style={{
                    width: '85%',
                    height: '47%',
                    position: 'absolute',
                    marginLeft: '3px',
                    marginTop: '48px',
                  }}
                />
              ) : (
                <Typography
                  variant="h6"
                  style={{
                    color: 'lightgrey',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  IMAGE
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid
            item
            container
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: 'inherit',
            }}
          >
            <Grid
              item
              style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                name="imgFile"
                onChange={e => changeImgFile(e.target.files[0])}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  style={{ width: '300px', height: '50px' }}
                >
                  <PhotoCamera />
                  <Typography variant="h6">영수증을 올려주세요!</Typography>
                </Button>
              </label>
            </Grid>
            <Grid
              item
              style={{
                width: '300px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                component="span"
                style={{ width: '300px', height: '50px' }}
                onClick={handleTranslate}
              >
                <ReceiptIcon />
                <Typography variant="h6">영수증을 등록하세요!</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">나라를 선택해주세요.</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-select-currency"
            select={true}
            fullWidth
            label="Country"
            value={country}
            onChange={handleChangeCountry}
          >
            <MenuItem key="1" value="미국">
              미국
            </MenuItem>
            <MenuItem key="2" value="일본">
              일본
            </MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            취소
          </Button>
          <Button onClick={getImg} color="primary">
            번역
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Note archived"
      >
        <Alert severity="error" onClick={handleCloseSnackbar}>
          {openDialog ? '나라를 선택해주세요.' : '사진을 등록해주세요!'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Main;
