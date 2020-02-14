import React from "react";
import styled from "styled-components";
import axios from 'axios'

const Video = () => {
    const sendImageToServer = (image) => {
        //axios.post('http://localhost:8000/getImage', image)
    }
  return (
    <VideoLayout>
      <h1>비디오화면</h1>
      <iframe
        id="iframe1"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/ZKFwQFBwQFU"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <button onclick={sendImageToServer}>서버로 이미지 보내기</button>
    </VideoLayout>
  );
};

const Div = styled.div`
  @media (max-width: 768px) {
    margin-top: 10vh;
    margin-bottom: 5vh;
    margin-left: 5%;
    margin-right: 5%;
  }
`;

const VideoLayout = styled.div`
  margin-top: 3vh;
  margin-bottom: 5vh;
  /* margin-left: 15%;
  margin-right: 15%; */
  /* border-style: solid; */
  background-color: white;
  /* color: white;
    align-items: flex-end; */
  display: grid;
  @media (max-width: 768px) {
    grid-template-columns: 100%;
    margin: 0;
  }
`;

const PostUserProfile = styled.div`
  /* 구분을 위한 스타일임 수정필요 */
  background-color: white;
  font-size: 1rem;
  font-family: Inconsolata;
`;

const PostContent = styled.div`
  /* 구분을 위한 스타일임 수정필요 */
  background-color: white;
  font-size: 1.5rem;
  font-family: Inconsolata;
`;

const ImageContent = styled.div`
  /* 구분을 위한 스타일임 수정필요 */
  background-color: white;
  padding-top: 5%;
  @media (max-width: 768px) {
    margin: 0;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding-left: 10%;
    padding-right: 10%;
  }
`;

const PostContentImageWrapper = styled.div`
  /* 구분을 위한 스타일임 수정필요 */
  max-width: 100%;
  overflow: hidden;
  height: auto;
`;

const PostContentImage = styled.img`
  /* 구분을 위한 스타일임 수정필요 */
  width: 100%;
  max-height: 90%;

  :hover {
    opacity: 0.5;
    box-shadow: 0 0 2px 1px rgba(0, 300, 186, 0.5);
  }
`;

export default Video;
