import React,{Component} from "react";
import styled from "styled-components";

// import PostList from "../../components/PostList";
// import NavBar from "../../components/NavBar";

// import TopBar from "../../components/TopBar";
// import MobileNavBar from "../../components/MobileNavBar";
// import CircularProgress from '@material-ui/core/CircularProgress';

class SecondPage extends Component {
  state={
    isLoading: false,
  }

  componentDidMount(){
    this.setState({isLoading:true},()=>{console.log(this.state.isLoading)})
    console.log(this.state.isLoading)
    fetch('list.json')
    .then(function(result){
      return result.json
    })
    .then(function(json){
      console.log(json);
      this.setState({isLoading:false})
    }.bind(this))
  }

  render(){
    return(
      <SecondPageLayout>

      </SecondPageLayout>
    )  
  }
}



const SecondPageLayout = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 290px;
  grid-template-areas: "nav content";
  @media (max-width: 768px) {
    grid-template-columns: 100vw;
  }
`;

const Div = styled.div`
  padding-bottom: 5%;
  display: grid;
  grid-template-rows: fit-content(9%) fit-content(9%) 82%;
`;

export default SecondPage;
