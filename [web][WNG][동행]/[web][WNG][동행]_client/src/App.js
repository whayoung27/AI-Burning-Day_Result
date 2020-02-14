import React, {Component} from 'react';
import WngMain from './WngMain';

class App extends Component {
  render() {
    const style = {
      AppWrap: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '500px'
      }
    }
    return (
      <div className="App" style={style.appWrap}>
        <WngMain />
      </div>
    );
  }
  
}

export default App;
