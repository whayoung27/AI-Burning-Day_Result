import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import Planet from '../svgs/Planet.svg';
import { ReactComponent as Logo } from '../svgs/Pictorial.svg';
import useRoom from '../hooks/useRoom';

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `,
  
  Planet: styled.div`
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-image: url(${Planet});
    background-position: center;
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `,

  Form: styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    svg {
      margin-bottom: 73px;
    }
  `,

  Input: styled.input`
    width: 340px;
    height: 55px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    background-color: #ffffff;
    border: none;
    text-align: center;
    font-family: inherit;
    font-weight: 700;
    font-size: 1.5em;
    letter-spacing: 2.8px;
    margin-top: 10px;

    &::placeholder {
      text-align: center;
    }
  `,

  JoinButton: styled.button`
    width: 200px;
    height: 65px;
    border-radius: 15px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    background-image: linear-gradient(to top, #210081, #0042a6);
    border: none;
    letter-spacing: 6.72px;
    color: white;
    font-size: 1.5em;
    font-family: inherit;
    font-weight: 800;
    margin-top: 29px;
    cursor: pointer;
  `,
  ErrorMsg: styled.div`
    color: red;
  `,
}

function Join() {
  const [name, setName] = useState('');
  const { onFetchRoomID, onConnectRoom, onSetCode, onCheckRoomCode, errorMsg } = useRoom();
  const { code } = useParams();

  const handleChangeInput = e => {
    setName(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (code) {
      onConnectRoom(name, code);
    } else {
      onFetchRoomID(name);
    }
  }

  useEffect(() => { 
    if (code) {
      onSetCode(code);
      onCheckRoomCode(code);
    }
  }, [onSetCode, onCheckRoomCode, code])

  return (
    <Styled.Container>
      <Styled.Planet>
        <Styled.Form onSubmit={handleSubmit}>
          <Logo />
          {
            errorMsg &&
            <Styled.ErrorMsg>
              { errorMsg }
            </Styled.ErrorMsg>
          }
          <Styled.Input
            value={name}
            onChange={handleChangeInput}
            placeholder="내 닉네임 입력"
          />
          <Styled.JoinButton>
            { code ? "참가하기" : "방만들기" }
          </Styled.JoinButton>
        </Styled.Form>
      </Styled.Planet>
    </Styled.Container>
  )
}

export default Join;