import React, { useState, useEffect } from 'react';
import { useParams, Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import useRoom from '../hooks/useRoom';

import Stars from '../svgs/Stars.svg';
import Circle from '../svgs/circle.svg';
import SmallCircle from '../svgs/small_circle.svg';
import AlienL1 from '../svgs/alienL1.svg';
import LinkShareBtn from '../svgs/link-share-btn.svg';
import { ReactComponent as Left } from '../svgs/left.svg';
import { ReactComponent as Right } from '../svgs/right.svg';
import { ReactComponent as Loading } from '../svgs/loading.svg';
import { ReactComponent as Ready } from '../svgs/check.svg';


const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background-image: url(${Stars});
    background-position: center;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    position: relative;
  `,
  Lobby: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `,
  Name: styled.h2`
    font-size: 42px;
    color: #ffffff;
    margin: 45px 0;
  `,
  CharacterSelectContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: left;
    margin-bottom: 64px;
  `,
  SelectButton: styled.span`
    display: inline-flex;
    cursor: pointer;
    margin-right: ${props => props.left && '64px'};
    margin-left: ${props => props.right && '47px'};
  `,
  AlienContainer: styled.div`
    width: 244px;
    height: 244px;
    background-image: url(${Circle});
    background-size: 100% 100%;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Alien: styled.div`
    background-image: url(${props => props.alien});
    background-size: 100% 100%;
    background-position: center;
    width: 200px;
    height: 200px;
  `,
  MiddleContainer: styled.div`
    width: 90%;
    max-width: 1024px;
    height: 155px;
    border-radius: 10px;
    background-image: linear-gradient(to right, #5728e2, #ec2c6f);
    text-align: center;
  `,
  StartButton: styled.button`
    position: relative;
    width: 215px;
    height: 70px;
    border-radius: 10px;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.25);
    border: solid 3px #ffffff;
    background-image: linear-gradient(to top, #5728e2, #210081);
    letter-spacing: 7.2px;
    color: #ffffff;
    font-family: inherit;
    font-weight: 800;
    font-size: 30px;
    bottom: 35px;
    cursor: pointer;
  `,
  OptionContainer: styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: left;
  `,
  Option: styled.div`
    font-family: inherit;
    font-weight: 800;
    font-size: 30px;
    letter-spacing: 3px;
    color: #ffffff;
  `,
  ListCircle: styled.div`
    width: 16px;
    height: 16px;
    background-color: #ffffff;
    border-radius: 8px;
    margin-right: 12px;
    display: inline-flex;
  `,
  Select: styled.select`
    width: 170px;
    height: 45px;
    border-radius: 10px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    background-color: #ffffff;
    font-size: 30px;
    color: #210081;
    font-family: inherit;
    font-weight: 800;
    padding: 6px 16px;
    margin-left: 24px;
  `,
  MemberListContainer: styled.div`
    margin-top: 61px;
    display: flex;
    justify-content: left;
    align-items: center;
    flex-direction: left;
  `,
  MemberContainer: styled.div`
    width: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 17px;
  `,
  MemberAlienContainer: styled.div`
    width: 140px;
    height: 140px;
    background-image: url(${SmallCircle});
    background-size: 100% 100%;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  MemberAlien: styled.div`
    width: 114px;
    height: 114px;
    background-image: url(${props => props.alien});
    background-size: 100% 100%;
    background-position: center;
  `,
  MemberName: styled.h3`
    font-size: 30px;
    color: #ffffff;
    margin: 28px 0 6px 0;
  `,
  MemberStatus: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 58px;
    height: 58px;
  `,
  LinkShareButton: styled.div`
    background-image: ${`url(${LinkShareBtn})`};
    position: absolute;
    top: 40px;
    left: 40px;
    width: 278px;
    height: 66px;
    background-size: 100% 100%;
    background-position: center;
    cursor: pointer;
  `,
}

let socket;

function Room() {
  const [nowPage, setNowPage] = useState('room');
  const { code } = useParams();
  const { name, connected, round, timeLimit, memberList, onSetRound, onSetTimeLimit, onSetMemberList } = useRoom();

  useEffect(() => {
    socket = io('http://pictorial.puterism.com/api/room');
    socket.emit('join', name, code);
    socket.on('message', ({text}) => {
      console.log(name);
      console.log(text);
    });
    socket.on('userData', ({userList}) => {
      console.log(userList);
      // const list = userList.filter(user => user.name !== name);
      onSetMemberList(userList);
    });
    socket.on('roomData', ({roomData}) => {
      console.log(roomData);
      onSetRound(roomData.round);
      onSetTimeLimit(roomData.time);
    });
  }, [name, code, onSetMemberList, onSetRound, onSetTimeLimit]);

  const handleLinkShare = () => {
    const url = `http://pictorial.puterism.com/${code}`;
    const textareaElement = document.createElement('textarea');
    textareaElement.value = url;
    document.body.appendChild(textareaElement);
    textareaElement.select();
    document.execCommand('copy');
    document.body.removeChild(textareaElement);
    // alert(`복사되었습니다! ${url}`);
  }

  const handleChangeRound = (e) => {
    const value = parseInt(e.target.value);
    onSetRound(value);
    socket.emit('setRoom', code, value, timeLimit);
  }

  const handleChangeTimeLimit = (e) => {
    const value = parseInt(e.target.value);
    onSetTimeLimit(value);
    socket.emit('setRoom', code, round, value);
  }

  const handleClickStart = () => {

  }

  return (
    <>
    {
      nowPage === 'room' &&
      <Styled.Container>
        {
          !connected &&
          <Redirect to="/"></Redirect>
        }
        <Styled.LinkShareButton onClick={handleLinkShare} />
        <Styled.Lobby>
          <Styled.Name>{ name }</Styled.Name>
          <Styled.CharacterSelectContainer>
            {/* <Styled.SelectButton left>
              <Left />
            </Styled.SelectButton> */}
            <Styled.AlienContainer>
              <Styled.Alien alien={AlienL1} />
            </Styled.AlienContainer>
            {/* <Styled.SelectButton right>
              <Right />
            </Styled.SelectButton> */}
          </Styled.CharacterSelectContainer>
          <Styled.MiddleContainer>
            <Link onClick={handleClickStart} to={`/room/${code}/upload`}>
              <Styled.StartButton>
                START
              </Styled.StartButton>
            </Link>
            <Styled.OptionContainer>
              <Styled.Option>
                <Styled.ListCircle />
                라운드 수
                <Styled.Select value={round} onChange={handleChangeRound}>
                  <option value={2} defaultValue>
                    2
                  </option>
                  <option value={3}>
                    3
                  </option>
                  <option value={5}>
                    5
                  </option>
                </Styled.Select>
              </Styled.Option>
              <Styled.Option>
                <Styled.ListCircle />
                제한 시간
                <Styled.Select value={timeLimit} onChange={handleChangeTimeLimit}>
                  <option value={3} defaultValue>
                    3s
                  </option>
                  <option value={5}>
                    5s
                  </option>
                  <option value={10}>
                    10s
                  </option>
                </Styled.Select>
              </Styled.Option>
            </Styled.OptionContainer>
          </Styled.MiddleContainer>
          <Styled.MemberListContainer>
            { 
              memberList.filter(member => member.name !== name).map((member) => (
                <Styled.MemberContainer key={member.id}>
                  <Styled.MemberAlienContainer>
                    <Styled.MemberAlien alien={AlienL1} />
                  </Styled.MemberAlienContainer>
                  <Styled.MemberName>{ member.name }</Styled.MemberName>
                  <Styled.MemberStatus>
                    <Ready />
                  </Styled.MemberStatus>
                </Styled.MemberContainer>
              ))
            }
          </Styled.MemberListContainer>
        </Styled.Lobby>
      </Styled.Container>
    }

    {/* {
      nowPage === 'imageUpload' &&
      <ImageUpload />
    }
    
    {
      nowPage === 'game' &&
      <Game /> */}
    }
    </>
  )
}

export default Room;