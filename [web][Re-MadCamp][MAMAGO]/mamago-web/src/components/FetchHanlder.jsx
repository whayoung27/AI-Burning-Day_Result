import React from 'react';
import { useSelector } from 'react-redux';

const FetchHandler = props => {
  const fetchs = useSelector(state => state.fetchs);

  return <>FetchHandler</>;
};

export default FetchHandler;
