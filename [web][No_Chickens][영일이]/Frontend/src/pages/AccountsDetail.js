import React, { useState, useEffect } from 'react';
import BaseAppBar from '../components/common/BaseAppBar';
import Drawar from '../components/common/Drawer';
import {
  Typography,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  MenuItem,
  Divider,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, ArcSeries } from 'react-vis';
import './AccountsDetail.scss';
import Panel from '../components/accounts/Panel';
import axios from 'axios';
import moment from 'moment';

const AccountsDetail = props => {
  const myData = [
    {
      angle0: 0,
      angle: Math.PI / 4,
      opacity: 0.2,
      radius: 2,
      radius0: 1,
      color: 1,
    },
    {
      angle0: Math.PI / 4,
      angle: (2 * Math.PI) / 4,
      radius: 3,
      radius0: 0,
      color: 2,
    },
    {
      angle0: (2 * Math.PI) / 4,
      angle: (3 * Math.PI) / 4,
      radius: 2,
      radius0: 0,
      color: 3,
    },
    {
      angle0: (3 * Math.PI) / 4,
      angle: (4 * Math.PI) / 4,
      radius: 2,
      radius0: 0,
      color: 4,
    },
    {
      angle0: (4 * Math.PI) / 4,
      angle: (5 * Math.PI) / 4,
      radius: 2,
      radius0: 0,
      color: 5,
    },
    {
      angle: 0,
      angle0: (5 * Math.PI) / 4,
      radius: 2,
      radius0: 1.5,
      color: 6,
    },
  ];

  const schedulePk = props.location.state.schedulePk;
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2019-12-09');
  const [country, setCounty] = useState('');
  const [scheduleName, setScheduleName] = useState('');
  const [receiptSet, setReceiptSet] = useState([]);

  const handleCloseExchangeDialog = () => {
    setOpenExchangeDialog(false);
  };

  const handleChangeCountry = event => {
    setCounty(event.target.value);
  };

  const getExchangeRequest = async () => {
    try {
      return await axios.get(
        `http://10.83.32.154:3000/naver/rate/${moment(selectedDate).format(
          'YYYYMMDD',
        )}/usa`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getExchange = async () => {
    const resData = await getExchangeRequest();
    console.log(resData);
    setOpenExchangeDialog(false);
  };

  const getReceiptsRequest = async () => {
    try {
      return await axios.get(
        `http://10.83.32.154:3000/accounts/v1/schedule/${schedulePk}`,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getReceipts = async () => {
    const rcpData = await getReceiptsRequest();
    console.log(rcpData.data[0]);
    setScheduleName(rcpData.data[0].schedule_name);
    setReceiptSet(rcpData.data[0].receipt_set);
  };

  useEffect(() => {
    getReceipts();
  }, []);

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
          containter
          direction="row"
          justify="space-around"
          alignItems="center"
          style={{ display: 'flex' }}
        >
          <Grid item style={{ display: 'inline-block' }}>
            <Typography variant="h3">{scheduleName}</Typography>
          </Grid>
          <Grid item style={{ display: 'inline-block' }}>
            <Typography variant="h6">19/12/09</Typography>
          </Grid>
          <Grid item style={{ display: 'inline-block' }}>
            <Typography variant="h6">미국</Typography>
          </Grid>
          <Grid
            item
            onClick={() => {
              setOpenExchangeDialog(true);
            }}
          >
            <Button>환율 계산</Button>
          </Grid>
        </Grid>
        <Divider />

        {receiptSet.map(item => (
          <Panel item={item} />
        ))}

        {/* <XYPlot xDomain={[-5, 5]} yDomain={[-5, 5]} width={300} height={300}>
          <ArcSeries
            data={myData}
            colorDomain={[0, 1, 6]}
            colorRange={['#fff', 'pink', 'blue']}
            colorType="linear"
          />
        </XYPlot> */}
      </div>
      <Dialog
        open={openExchangeDialog}
        onClose={handleCloseExchangeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">환율 날짜 변경</DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              disableToolbar
              variant="dialog"
              label="Date"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </MuiPickersUtilsProvider>
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
          <Button onClick={handleCloseExchangeDialog} color="primary">
            취소
          </Button>
          <Button
            onClick={() => {
              getExchange();
            }}
            color="primary"
          >
            수정
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccountsDetail;
