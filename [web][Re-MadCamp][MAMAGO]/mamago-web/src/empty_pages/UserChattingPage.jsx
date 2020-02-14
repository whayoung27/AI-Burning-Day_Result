import React from 'react';
import Header from '../components/Header';

const UserChattingPage = props => {
  const {
    match: {
      params: { chat_id }
    }
  } = props;
  return (
    <>
      <Header />
      <div>UserChattingPage!! chat_id: {chat_id}</div>
    </>
  );
};

export default UserChattingPage;
