import React, { useState, useEffect } from 'react';
import cookies from 'js-cookie';
import * as R from 'ramda';
import styled from 'styled-components';
import Header from '../components/Header';
import { useDispatch } from 'react-redux';
import { login } from '../actions/users';
import { validateEmail, validatePassword } from '../services/util';
import { useHistory } from 'react-router';

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
`;

const ButtonHeader = styled.button`
  width: 304px;
  height: 50px;
  margin-top: 20px;
  border: none;
  background-color: #4caf50;
  color: white;
  text-aling: center;
  display: inline-block;
  font-size: 16px;
`;

function LoginPage(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const access_token = cookies.get('access_token');

  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });

  const { email, password } = inputs;

  useEffect(() => {
    if (!R.isNil(access_token) && !R.isEmpty(access_token)) {
      history.push('/');
    }
  }, [access_token]);

  const onChange = e => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const onClick = e => {
    e.preventDefault();
    if (validateEmail(email) && validatePassword(password)) {
      dispatch(login({ email: email, password: password, afterSuccess: () => history.push('/') }));
      setInputs({
        email: '',
        password: ''
      });
    }
  };

  return (
    <>
      <BlockHeader>
        <TitleHeader>
          <ImageHeader src={require('../images/mamago_logo.png')} />
          <TextHeader>Mamago</TextHeader>
        </TitleHeader>
        <div>
          <LoginInput
            name="email"
            placeholder="아이디"
            onChange={onChange}
            value={email}
            type="email"
          />
        </div>
        <div>
          <LoginInput
            name="password"
            placeholder="비밀번호"
            onChange={onChange}
            value={password}
            type="password"
          />
        </div>
        <div>
          <ButtonHeader onClick={onClick}>로그인</ButtonHeader>
        </div>
      </BlockHeader>
    </>
  );
}

export default LoginPage;
