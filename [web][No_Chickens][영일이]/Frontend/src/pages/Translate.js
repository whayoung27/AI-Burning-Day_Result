import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ExifOrientationImg from 'react-exif-orientation-img';
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Slide,
} from '@material-ui/core';
import TranslateItem from '../components/translate/TranslateItem';
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Translate = props => {
  const history = useHistory();
  const translateData = props.location.state.translateData;
  const [imgBase64, setImgBase64] = useState(props.location.state.imgBase64);
  const [openImgDialog, setOpenImgDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [schedule, setSchedule] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [goods, setGoods] = useState(translateData.goods);

  const handleCloseImgDialog = () => {
    setOpenImgDialog(false);
  };

  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false);
  };

  const handleChangeSchedule = event => {
    setSchedule(event.target.value);
  };

  const getSchedulesRequest = async () => {
    try {
      return await axios.get('http://10.83.32.154:3000/accounts/v1/schedules/');
    } catch (error) {
      console.error(error);
    }
  };

  const getSchedules = async () => {
    const schData = await getSchedulesRequest();
    console.log(schData);
    setSchedules(schData.data);
  };

  useEffect(() => {
    getSchedules();
  }, []);

  const [isAdd, setIsAdd] = useState(false);

  const postReceiptRequest = async () => {
    try {
      return await axios.post(
        `http://10.83.32.154:3000/accounts/v1/receipt/${translateData.id}/`,
        {
          schedule_pk: schedule,
          place_origin: placeOrigin,
          plcae_trans: '',
          country: 'usa',
          total: total,
          goods: goods,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const postReceipt = async () => {
    await postReceiptRequest();
    history.push({
      pathname: '/AccountsDetail',
      state: { schedulePk: schedule },
    });
  };

  const [placeOrigin, setPlaceOrigin] = useState(translateData.place_origin);

  const handleChangePlaceOrigin = event => {
    setPlaceOrigin(event.target.value);
  };

  const [total, setTotal] = useState(translateData.total);

  const handleChangeTotal = event => {
    setTotal(event.target.value);
  };

  return (
    <>
      <div
        style={{
          width: 'inherit',
          height: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        <Grid
          item
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <PhotoCamera
            onClick={() => {
              setOpenImgDialog(true);
            }}
          />
        </Grid>

        <Grid
          containter
          direction="row"
          justify="space-around"
          alignItems="center"
          style={{ display: 'flex', width: 'inherit' }}
        >
          <Grid item style={{ display: 'inline-block' }}>
            <Typography>상호명</Typography>
          </Grid>
          <Grid item style={{ display: 'inline-block' }}>
            <TextField
              id="standard-basic"
              label="상호명"
              value={placeOrigin}
              onChange={handleChangePlaceOrigin}
            />
          </Grid>
        </Grid>

        <Grid
          containter
          direction="row"
          justify="space-around"
          alignItems="center"
          style={{ display: 'flex', width: 'inherit' }}
        >
          <Grid item style={{ display: 'inline-block' }}>
            <Typography>총액($)</Typography>
          </Grid>
          <Grid item style={{ display: 'inline-block' }}>
            <TextField
              id="standard-basic"
              label="총액"
              value={total}
              onChange={handleChangeTotal}
            />
          </Grid>
        </Grid>

        {goods.map(item => (
          <TranslateItem ko={item.ko} value={item.value} />
        ))}

        {isAdd && <TranslateItem />}

        <Grid
          containter
          direction="row"
          justify="center"
          alignItems="center"
          style={{ display: 'flex', width: 'inherit' }}
          onClick={() => {
            setIsAdd(true);
          }}
        >
          <Grid item style={{ display: 'inline-block' }}>
            <AddCircleIcon />
          </Grid>
          <Grid item style={{ display: 'inline-block' }}>
            <Typography>상품 추가</Typography>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
          style={{ display: 'flex', width: 'inherit' }}
        >
          <Grid item>
            <Button
              onClick={() => {
                history.push('/');
              }}
            >
              <Typography variant="h5">취소</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                setOpenSubmitDialog(true);
              }}
            >
              <Typography variant="h5">저장</Typography>
            </Button>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={openImgDialog}
        onClose={handleCloseImgDialog}
        TransitionComponent={Transition}
      >
        <DialogTitle id="form-dialog-title">영수증을 확인하세요.</DialogTitle>
        <DialogContent>
          <ExifOrientationImg
            src={imgBase64}
            alt="img"
            style={{
              height: '300px',
              width: '350px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImgDialog} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSubmitDialog}
        onClose={handleCloseSubmitDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">스케쥴을 선택해주세요.</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-select-currency"
            select={true}
            fullWidth
            label="Schedule"
            value={schedule}
            onChange={handleChangeSchedule}
          >
            {schedules.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.schedule_name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleCloseSubmitDialog} color="primary">
            생성
          </Button>
          <Button onClick={postReceipt} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Translate;

// data = {
//   'place_origin' : '',
//   'plcae_trans' : '',
//   'country' : 'usa',
//   'total' : '',
//   'goods' : {
//       'en1' : {
//           'value' : 15,
//           'ko' : 'ko1',
//       },
//       'en2' : {
//           'value' : 22,
//           'ko' : 'ko2',
//       },
//   }
// }
