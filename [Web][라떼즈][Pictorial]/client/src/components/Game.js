import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import useRoom from '../hooks/useRoom';
import io from 'socket.io-client';

import Stars from '../svgs/Stars.svg';
import FindingMark from '../svgs/finding-mark.svg';
import FoundMark from '../svgs/found-mark.svg';
import ImageOwnerMark from '../svgs/image-owner-mark.svg';
import Alien6 from '../svgs/A6.png';

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background-image: url(${Stars});
    background-position: center;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
  `,
  GameContainer: styled.div`
    width: 80%;
    min-width: 1000px;
    margin: 0 auto;
  `,
  Header: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  Round: styled.h2`
    font-size: 48px; 
    letter-spacing: 4.8px;
    font-weight: 800;
    color: #ffffff;
  `,
  Keyword: styled.h2`
    font-size: 48px;
    letter-spacing: 11.52px;
    font-weight: 800;
    color: #ffffff;
  `,
  Author: styled.h3`
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 2.4px;
    color: #ffffff;
  `,
  ContentContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: top;
  `,
  MemberList: styled.div`
    flex: 1;
  `,
  MemberStat: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: left;
  `,
  MemberAlien: styled.div`
    background-image: ${props => `url(${props.alien})`};
    background-size: 100% 100%;
    background-position: center;
    width: 83px;
    height: 83px;
    margin-right: 14px;
  `,
  MemberProfile: styled.div`
    display: flex;
    justify-content: left;
    flex-direction: column;
    margin-right: 25px;
    width: 200px;
  `,
  MemberName: styled.h3`
    font-size: 20px;
    color: #c4c4c4;
    margin: 0;
  `,
  MemberScore: styled.h3`
    font-size: 48px;
    font-weight: 300;
    letter-spacing: 6.24px;
    color: #ffffff;
    margin: 0;
  `,
  MemberStatus: styled.div`
    width: 81px;
    height: 32px;
    background-image: ${props => {
      if (props.finding) return `url(${FindingMark})`;
      else if (props.found) return`url(${FoundMark})`;
      else if (props.owner) return `url(${ImageOwnerMark})`;
    }};
    background-position: left;
    background-repeat: no-repeat;
  `,
  Game: styled.div`
    flex: 2;
  `,
  ImageBox: styled.div`
    width: 800px;
    height: 620px;
    box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.25);
    border-style: solid;
    border-width: 6px;
    border-image-source: linear-gradient(to right, #5728e2, #210081);
    border-image-slice: 1;
    background-color: rgba(0, 0, 0, 0.1);
    background-image: ${props => `url(${props.image})`};
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `,

  TimerContainer: styled.div`
    position: relative;
    top: 50px;
    width: 100%;
    float: none;
    clear: both;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  TimerText: styled.div`
    padding-right: 30px;
    font-size: 34px;
    color: #ffffff;
  `,
  TimerBar: styled.div`
    flex: 1;
    height: 30px;
    border-radius: 15px;
    background-color: #c4c4c4;
  `,
  TimerBarCurrent: styled.div`
    width: ${props => `${props.percentage}%`};
    height: 30px;
    border-radius: 15px;
    background-image: linear-gradient(to top, #a806b5, #5728e2);
  `,
}

let socket;

function Game() {
  const { name, code, connected, memberList, onSetMemberList, round, timeLimit, onImageReady, images } = useRoom();
  const [nowRound, setNowRound] = useState(1);
  const [nowTime, setNowTime] = useState(timeLimit);

  useEffect(() => {
    socket = io('http://pictorial.puterism.com/api/room');
    socket.emit('ready', name, code);
    // console.log(name, code);
    // socket.on('readyUserData', ({userData}) => {
    //   console.log(userData);
    //   onSetMemberList(userData);
    // })
  }, [name, code]);

  useEffect(() => {
    if (!nowTime) return;

    const timer = setInterval(() => {
      setNowTime(nowTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [nowTime]);

  return (
    <Styled.Container>
      {
        !connected &&
        <Redirect to="/"></Redirect>
      }
      <Styled.GameContainer>
        <Styled.Header>
          <Styled.Round>
            { nowRound } / { round } ROUND
          </Styled.Round>
          <Styled.Keyword>
            플레이어를 기다리는 중...
          </Styled.Keyword>
          <Styled.Author>
            {/* By LOGE */}
          </Styled.Author>
        </Styled.Header>
        <Styled.ContentContainer>
          <Styled.MemberList>
            {
              memberList.map((member) => (
                <Styled.MemberStat key={member.id}>
                  <Styled.MemberAlien alien={Alien6} />
                  <Styled.MemberProfile>
                    <Styled.MemberName>{member.name}</Styled.MemberName>
                    <Styled.MemberScore>{member.score}</Styled.MemberScore>
                  </Styled.MemberProfile>
                  <Styled.MemberStatus finding />
                </Styled.MemberStat>
              ))
            }
          </Styled.MemberList>

          <Styled.Game>
            <Styled.ImageBox>

            </Styled.ImageBox>
          </Styled.Game>
        </Styled.ContentContainer>
        <Styled.TimerContainer>
          <Styled.TimerText>
            { nowTime } s
          </Styled.TimerText>
          <Styled.TimerBar>
            <Styled.TimerBarCurrent percentage={(100 / timeLimit) * nowTime} />
          </Styled.TimerBar>
        </Styled.TimerContainer>
      </Styled.GameContainer>
    </Styled.Container>
  )
}

export default Game;