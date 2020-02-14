import React,{Component} from "react";
import styled from "styled-components";

import StartCanvas from "../../components/StartCanvas"
// import Video from "../../components/Video";

// import PostList from "../../components/PostList";
// import NavBar from "../../components/NavBar";

// import TopBar from "../../components/TopBar";
// import MobileNavBar from "../../components/MobileNavBar";
// import CircularProgress from '@material-ui/core/CircularProgress';

class MainPage extends Component {
  render(){
    return(
      <MainPageLayout>
          <StartCanvas></StartCanvas>
          {/* <Video></Video> */}

      </MainPageLayout>
    )  
  }
}



const MainPageLayout = styled.div`
  height: 100vh;
  /* display: grid;
  grid-template-columns: 50% 50%; */
`;

export default MainPage;
