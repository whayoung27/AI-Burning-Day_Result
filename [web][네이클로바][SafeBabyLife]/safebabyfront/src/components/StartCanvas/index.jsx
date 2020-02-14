import React, { Component } from "react";
import styled from "styled-components";

import axios from "axios";

class StartCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positions: [],
      videourl: "",
      imageSrc: "",
    };

    // this.handleImageFiles = this.handleImageFiles.bind(this)
    this.reset = this.reset.bind(this);
    this.mouseClickOnCanvas = this.mouseClickOnCanvas.bind(this);
    this.mousePos = this.mousePos.bind(this);
    this.sendPoints = this.sendPoints.bind(this);
    // this.checkFirstImage = this.checkFirstImage.bind(this)
    // this.onChangeInput = this.onChangeInput.bind(this)
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "http://localhost:8000/web/getFirstImage/"
    }).then(res => {
      var cvs = document.getElementById("canvas");
      var ctx = cvs.getContext("2d");

      var image = new Image();
      image.src = "data:image/jpg;base64," + res.data;
      this.setState({imageSrc: image.src})
      image.onload = function() {
        cvs.width = image.width;
        cvs.height = image.height;
        ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
      };
    });
  }

  // onChangeInput = e => {
  //   this.setState({videourl: e.target.value})
  // }

  // checkFirstImage = e => {
  //   axios({
  //     method: 'post',
  //     url: 'http://localhost:8000/web/getValue/',
  //     data: {
  //       url: this.state.videourl, //'https://www.youtube.com/watch?v=jzNdJ5Iq3ps',
  //       data: this.state.positions
  //     }
  //   }).then(res => {
  //     console.log(res)
  //   })
  // }

  sendPoints = e => {
    if (this.state.positions.length < 4){
      alert("4점을 모두 찍어주세요")
      return;
    }

    axios({
      method: "post",
      url: "http://localhost:8000/web/getValue/",
      data: {
        points: this.state.positions
      }
    }).then(res => {
      console.log(res)
    });
  };

  // handleImageFiles = e => {
  //   var url = window.URL.createObjectURL(e.target.files[0]);
  //   var cvs = document.getElementById("canvas");
  //   var ctx = cvs.getContext("2d");
  //   var img = new Image();
  //   img.onload = function() {
  //     cvs.width = img.width;
  //     cvs.height = img.height;
  //     console.log(cvs.width);
  //     console.log(cvs.height);
  //     ctx.drawImage(img, 0, 0);
  //   };

  //   img.src = url;
  // };

  reset = () => {
    this.setState({ positions: [] });
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext("2d");
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    var image = new Image();
    image.src = this.state.imageSrc;
    image.onload = function() {
      cvs.width = image.width;
      cvs.height = image.height;
      ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
    };
  };

  mouseClickOnCanvas = e => {
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext("2d");
    //var res = document.getElementById("results");
    var rect = cvs.getBoundingClientRect();
    var x = parseInt(e.clientX - rect.left);
    var y = parseInt(e.clientY - rect.top);
    var p = ctx.getImageData(x, y, 1, 1).data;

    const clickdata = this.state.positions;
    if (clickdata.length < 4) {
      const newdata = clickdata.concat({ x: x, y: y });
      this.setState({
        positions: newdata
      });

      if (clickdata.length > 0) {
        ctx.beginPath();
        ctx.moveTo(
          clickdata[clickdata.length - 1].x,
          clickdata[clickdata.length - 1].y
        );
        ctx.lineTo(x, y);
        ctx.lineWidth = 10;
        ctx.strokeStyle= "#00FF00"
        ctx.stroke();
        // 4번째 입력시에
        if (clickdata.length === 3) {
          ctx.beginPath();
          ctx.moveTo(
          clickdata[0].x,
          clickdata[0].y
        );
          ctx.lineTo(x, y);
          ctx.lineWidth = 10;
          ctx.strokeStyle= "#00FF00"
          ctx.stroke();
        }
      }
    } else {
      alert("입력 불가합니다. 초기화해주세요.");
    }
  };

  mousePos = e => {
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext("2d");
    //var res = document.getElementById("results");
    var rect = cvs.getBoundingClientRect();
    var x = parseInt(e.clientX - rect.left);
    var y = parseInt(e.clientY - rect.top);
    var p = ctx.getImageData(x, y, 1, 1).data;
    // res.innerHTML =
    // '<p> X:' + x + 'Y:' + y + '</p>'
    return { x, y };
  };
  render() {
    return (
      <StartCanvasLayout>
        <div>
          <h1><b>가이드라인 설정</b></h1>
          {/* <input onChange={this.onChangeInput}  placeholder="유튜브 영상 주소를 입력하세요"></input> */}
          {/* <button onClick={this.checkFirstImage}>첫 화면 체크</button> */}
          <button onClick={this.reset}>선택초기화</button>
          <button onClick={this.sendPoints}>가이드포인트 전달</button>
          {/* <input type="file" onChange={this.handleImageFiles}></input> */}
          <p>이미지에서 시계/반시계 방향으로 네 점을 잡아주세요</p>
          {/* <div id="results">
            마우스 오버된 포지션 좌표 전달
          </div> */}

          <Canvas
            id="canvas"
            style={{ margin: "12px" }}
            onClick={this.mouseClickOnCanvas}
            onMouseMove={this.mousePos}
          ></Canvas>
        </div>
      </StartCanvasLayout>
    );
  }
}

const StartCanvasLayout = styled.div`
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

const PostContentImage = styled.img`
  /* 구분을 위한 스타일임 수정필요 */
  width: 100%;
  max-height: 90%;

  :hover {
    opacity: 0.5;
    box-shadow: 0 0 2px 1px rgba(0, 300, 186, 0.5);
  }
`;

const Canvas = styled.canvas`
  border-style: solid;
  border-width: 2px;
  border-color: black;
`;

export default StartCanvas;
