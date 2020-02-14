import React, { useState } from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import styled from 'styled-components';

const Block = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.div`
  text-align: center;
`;

const Text = styled.span`
  font-weight: bold;
  font-size: 25px;
  line-height: 60px;
  vertical-algin: middle;
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  vertical-align: middle;
`;

const Background = styled.div`
  width: 340px;
  height: 400px;
  outline: 1px solid black;
`;

const MessageContainer = styled.li`
  width: 100%;
  float: left;
  list-style: none;
  text-align: left;
`;

const MamagoMessage = styled.div`
  max-width: 70%;
  float: left;
`;

const UserMessage = styled.div`
  max-width: 70%;
  float: right;
  text-align: left;
`;

const UserInput = styled.input`
  width: 280px;
  height: 30px;
  font-size: 15px;
  margin-top: 10px;
  outline: 1px solid black;
`;

const SendButton = styled.button`
  vertical-align: middle;
  background-color: transparent;
  border: none;
  img {
    width: 40px;
    height: 40px;
  }
`;

const ChattingPage = props => {
  const [inputs, setInputs] = useState({
    question: '',
    original: '',
    translated: '',
    comprehended: '',
    feedback: false,
    user_intention: '',
    user_intention_translated: ''
  });

  const { original } = inputs;

  const onChange = e => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const onClick = () => {
    setInputs({
      original: ''
    });
  };

  return (
    <>
      <Header />
      <Main>
        <Block>
          <Title>
            <Image src={require('../images/mamago_logo.png')} />
            <Text>MAMAGO</Text>
          </Title>
          <Background>
            <MessageContainer>
              <MamagoMessage>Question</MamagoMessage>
            </MessageContainer>

            <MessageContainer>
              <UserMessage>Answer</UserMessage>
            </MessageContainer>
          </Background>
          <div>
            <span>
              <UserInput
                name="original"
                placeholder="마마고와 대화를 시작하세요!"
                onChange={onChange}
                value={original}
              />
            </span>
            <span>
              <SendButton onClick={onClick}>
                <img src={require('../images/send.png')} />
              </SendButton>
            </span>
          </div>
        </Block>
      </Main>

      <div>
        <b>value: </b>
        {original}
      </div>
    </>
  );
};

export default ChattingPage;
