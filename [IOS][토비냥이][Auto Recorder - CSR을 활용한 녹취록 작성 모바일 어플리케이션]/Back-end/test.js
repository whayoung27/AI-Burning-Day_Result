export default class ListScreen extends React.Component {

    render() {
      return (
        <LoadingContainer
          onLoadStartAsync={this._loadInitialDataAsync.bind(this)}
          onReadyAsync={this._onReadyAsync.bind(this)}>
          { /* render content */ }
        </LoadingContainer>
      );
    }
  
    async _loadInitialDataAsync() {
      let response = await fetchWithTimeout('https://www.reddit.com/r/reactnative.json');
      return response.json();
    }
  
    async _onReadyAsync({data: {children: stories}}) {
      return new Promise((resolve) => {
        this.setState({stories}, resolve);
      });
    }
  
  }
  