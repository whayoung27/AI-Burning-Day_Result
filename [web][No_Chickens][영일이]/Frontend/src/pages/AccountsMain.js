import React, { useEffect, useState } from 'react';
import BaseAppBar from '../components/common/BaseAppBar';
import Drawar from '../components/common/Drawer';
import axios from 'axios';
import { MenuItem } from '@material-ui/core';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import { useHistory } from 'react-router-dom';

const AccountsMain = () => {
  const history = useHistory();
  const [schedules, setSchedules] = useState([]);

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
        {schedules.map(option => (
          <MenuItem
            key={option.id}
            value={option.id}
            style={{ display: 'flex', justifyContent: 'space-around' }}
            onClick={() => {
              history.push({
                pathname: '/AccountsDetail',
                state: { schedulePk: option.id },
              });
            }}
          >
            <CardTravelIcon />
            {option.schedule_name}
          </MenuItem>
        ))}
      </div>
    </>
  );
};

export default AccountsMain;
