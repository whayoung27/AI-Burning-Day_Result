import React, { useState } from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import styled from 'styled-components';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import Calendar from 'react-calendar';

{
  /* Data List from server */
}
const logs = [
  {
    id: '1',
    date: '2020-02-05',
    subject: 'daily log',
    input: 'I ate milk-tea. It was so delicious.',
    output: 'I ate mild tea. It was so delicious.',
    hangeul: '나는 밀크티를 먹었다. 매우 맛있었다.'
  },
  {
    id: '2',
    date: '2020-02-12',
    subject: 'favorite music',
    input: 'I like ambition music. There music is so emphathsis.',
    output: 'I like ambition music. Music is very sympathetic there.',
    hangeul: '나는 엠비션 뮤직을 좋아한다. 그들의 음악은 매우 공감된다.'
  }
];

{
  /* tag + style components */
}
const WholeBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rem;
  height: 30rem;
`;

const SearchBox = styled.div`
  width: 20rem;
`;

const SearchInput = styled.input`
  width: 12rem;
  height: 2rem;
  font-size: 15px;
  border: 1px solid black;
  border-radius: 10px;

  // background-image: url('../icons/search.png');
  // background-repeat: no-repeat;
  // background-position: center;
  padding-right: 2rem;
  padding-left: 10px;
`;

const SearchButtons = styled.button`
  outline-color: #d48a6e;
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  left: 12.5rem;
  height: 2rem;

  img {
    border: none;
    background-color: none;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin-top: 3px;
  }
`;

const Buttons = styled.button`
  outline-color: #d48a6e;
  background-color: transparent;
  border: none;
  cursor: pointer;
  height: 2rem;

  img {
    border: none;
    background-color: none;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin-top: 3px;
  }
`;

const ShowBox = styled.div`
  width: 20rem;
  height: 25rem;
  margin-top: 1rem;
`;

{
  /* Modal - Select Date */
}
const ModalWapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  display: ${props => (props.display ? 'flex' : 'none')};
`;

const Modal = styled.div`
  background: white;
  padding: 24px 16px;
  border-radius: 4px;
  width: 320px;
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const CloseWrapper = styled.div`
  text-align: right;
`;

const ClockButton = props => {
  // Modal
  const [state, setState] = useState(false);

  const onClickOpen = e => {
    e.preventDefault();
    console.log('open');

    setState(prevState => !prevState);
    console.log(state);
  };

  const onClickClose = e => {
    e.preventDefault();
    console.log('close');

    setState(prevState => !prevState);
    console.log(state);
  };

  // Calender
  const moment = require('moment');

  const date = {
    day: new Date()
  };

  const onDateChange = date => {
    setState({
      date: moment(date).format('YYYY-MM-DD')
    });
  };

  return (
    <>
      <Buttons type="button" onClick={onClickOpen}>
        <img src={require('../icons/clock.png')} />
      </Buttons>
      <ModalWapper display={state}>
        <Modal>
          <ModalTitle>타임머신</ModalTitle>
          <Calendar onChange={onDateChange} value={date.day} />
          <CloseWrapper>
            <button onClick={onClickClose}>close</button>
          </CloseWrapper>
        </Modal>
      </ModalWapper>
    </>
  );
};

{
  /* Parsing Databaset datasets and Showing */
}
function User({ user, isDate, isSubject, isInput, isOutput, isHangeul }) {
  return (
    <span>
      {isDate && user.date}
      {isSubject && user.subject}
      {isInput && user.input}
      {isOutput && user.output}
      {isHangeul && user.hangeul}
    </span>
  );
}

function ReturnDate() {
  return (
    <span>
      <User
        isDate={true}
        isSubject={false}
        isInput={false}
        isOutput={false}
        isHangeul={false}
        user={logs[0]}
      />
    </span>
  );
}

function ReturnSubject() {
  return (
    <div>
      subject:{' '}
      <User
        isDate={false}
        isSubject={true}
        isInput={false}
        isOutput={false}
        isHangeul={false}
        user={logs[0]}
      />
    </div>
  );
}

function ReturnInput() {
  return (
    <div>
      input:{' '}
      <User
        isDate={false}
        isSubject={false}
        isInput={true}
        isOutput={false}
        isHangeul={false}
        user={logs[0]}
      />
    </div>
  );
}

function ReturnOutput() {
  return (
    <div>
      output:{' '}
      <User
        isDate={false}
        isSubject={false}
        isInput={false}
        isOutput={true}
        isHangeul={false}
        user={logs[0]}
      />
    </div>
  );
}

function ReturnHangeul() {
  return (
    <div>
      subject:{' '}
      <User
        isDate={false}
        isSubject={false}
        isInput={false}
        isOutput={false}
        isHangeul={true}
        user={logs[0]}
      />
    </div>
  );
}

{
  /* Swipe */
}
const BindKey = bindKeyboard(SwipeableViews);
const Swipe = () => {
  return (
    <BindKey>
      <div>slide 1</div>
      <div>slide 2</div>
      <div>slide 3</div>
    </BindKey>
  );
};

{
  /* Rendering at DOM */
}
const LogsPage = props => {
  return (
    <>
      <Header />
      <Main>
        <WholeBox>
          <SearchBox>
            <SearchInput></SearchInput>
            <SearchButtons>
              <img src={require('../icons/search.png')} />
            </SearchButtons>
            <ClockButton />
            <Buttons>
              <img src={require('../icons/up_button.png')} />
            </Buttons>
            <Buttons>
              <img src={require('../icons/down_button.png')} />
            </Buttons>
          </SearchBox>
          <ShowBox>
            <Swipe />
            {/* <SwipeableViews>
              <div>
                slide 1
              </div>
              <div>
                slide 2
              </div>
              <div>
                slide 3
              </div>
            </SwipeableViews> */}
          </ShowBox>
        </WholeBox>
      </Main>
    </>
  );
};

export default LogsPage;
