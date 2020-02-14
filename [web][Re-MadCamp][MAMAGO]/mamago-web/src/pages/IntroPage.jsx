import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Main from '../components/Main';
import '../font.css';
import { useHistory } from 'react-router';

const Text = styled.div`
  max-width: 100%;
  left: 26px;
  top: 66px;
  font-size: 2rem;
  padding: 2px;
  font-weight: bold;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const Image = styled.img`
  border: none;
  width: 100%;
  height: 60%;
  text-align: center;
  vertical-align: middle;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3px;
`;

const Talk = styled.button`
  position: fixed;
  width: 50%;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  font-size: 1rem;
  color: white;
  font-weight: bold;
  bottom: 0;
  left: 0;
  background-color: #3dc728;
  z-index: 999;
`;

const PastLog = styled.button`
  position: fixed;
  width: 50%;
  height: 3rem;
  line-height: 3rem;
  font-size: 1rem;
  text-align: center;
  color: white;
  font-weight: bold;
  bottom: 0;
  right: 0;
  background-color: #5d90f5;
  z-index: 999;
`;

const IntroPage = props => {
  const history = useHistory();

  return (
    <>
      <Header />
      <Main>
        <Text>인공지능 영어튜터와</Text>
        <Text>어디서나 언제든지!</Text>
        <Text>하루 10분으로</Text>
        <Text>영어 실력을 키워요!</Text>
        <Image src={require('../images/mamago_logo.png')}></Image>
      </Main>
      <Talk
        onClick={e => {
          e.preventDefault();
          history.push('/tempchat');
        }}
      >
        대화하기
      </Talk>
      <PastLog
        onClick={e => {
          e.preventDefault();
          history.push('/logs');
        }}
      >
        지난 기록
      </PastLog>
    </>
  );
};

export default IntroPage;
