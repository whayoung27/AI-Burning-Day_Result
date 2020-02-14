import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

export const ErrorHandler = props => {
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  return <div>{errors.length}</div>;
};
