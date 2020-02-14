import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import React from "react";
import Loader from "react-loader-spinner";
import "./LoadingView.scss"

class LoadingView extends React.Component {
  //other logic
  render() {
    return (
      <div className="LoadingView_container">
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      </div>
    );
  }
}

export default LoadingView;