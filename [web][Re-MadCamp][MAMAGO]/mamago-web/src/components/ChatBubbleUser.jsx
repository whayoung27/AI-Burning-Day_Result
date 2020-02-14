import React, {useState} from 'react';
import styled from 'styled-components';


const ChatBubbleUser = styled.div`
  position:relative;
  padding: 0.5rem 1rem;
  color: black;
  border-radius: 30px;
  
  margin-top: 4px;
  margin-left: 1rem;
  margin-right: 6rem;
  background: #d1c4e9;
  z-index: 2;

  font-size: 1rem;

  :after {
    content: "";
    position: absolute;
    border-style: solid;
    /* reduce the damage in FF3.0 */
    display:block;
    width: 0;

    top: 1rem;
    left: -1.3rem; /* value = - border-left-width - border-right-width */
    bottom:auto;
    border-width: 1rem 1.5rem 0 0; /* vary these values to change the angle of the vertex */
    border-color:transparent #d1c4e9;
    z-index: 1;
  }
`

export default ChatBubbleUser;