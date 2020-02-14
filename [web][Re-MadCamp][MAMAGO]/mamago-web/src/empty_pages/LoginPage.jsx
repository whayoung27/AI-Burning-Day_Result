import React, {useState} from 'react';
import styled from 'styled-components';
import Header from '../components/Header';

const BlockHeader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const TitleHeader = styled.div`
  text-align: center;
`;

const TextHeader = styled.span`
  font-weight: bold;
  font-size: 25px;
  line-height: 60px;
  vertical-algin: middle;
`;

const ImageHeader = styled.img`
  width: 60px;
  height: 60px;
  vertical-align: middle;
`;

const LoginInput = styled.input`
  width: 300px;
  height: 30px;
  font-size: 15px;
  margin-top: 10px;
  outline: 1px solid black;
`

const ButtonHeader = styled.button`
  width: 304px;
  height: 50px;
  margin-top: 20px;
  border: none;
  background-color: #4CAF50;
  color: white;
  text-aling: center;
  display: inline-block;
  font-size: 16px;
`

function LoginPage() {
  const [inputs, setInputs] = useState({
    id: '',
    password: ''
  });

  const {id, password} = inputs;

  const onChange = (e) => {
    const{value, name} = e.target;
    setInputs({
      ...inputs,
      [name]: value
    })
  }

  const onClick = () => {
    setInputs({
      id: '',
      password: ''
    })
  }

  return (
    <>
      <BlockHeader>
        <TitleHeader>
          <ImageHeader src={require("../images/mamago_logo.png")} />
          <TextHeader>Mamago</TextHeader>
        </TitleHeader>
        <div>
          <LoginInput name="id" placeholder="아이디" onChange={onChange} value={id} />
        </div>
        <div>
          <LoginInput name="password" placeholder="비밀번호" onChange={onChange} value={password}/>
        </div>
        <div>
          <ButtonHeader onClick={onClick}>로그인</ButtonHeader>
        </div>
      </BlockHeader>

      <div>
        <b>value: </b>
          {id} ({password})
      </div>
    </>
  )

}


export default LoginPage;
