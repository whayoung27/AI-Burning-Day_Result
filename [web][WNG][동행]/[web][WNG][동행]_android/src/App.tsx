import * as React from 'react';
import styled from 'styled-components/native';
import Voice from 'react-native-voice';
//import RestClient from 'react-native-rest-client';
//import RestfulClient from 'react-native-restful-client';
import axios from 'axios';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5fcff;
`;
const ButtonRecord = styled.Button``;
const VoiceText = styled.Text`
  margin: 32px;
`;
interface Props {}
interface State {
  isRecord: boolean;
  voice: string;
}
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isRecord: false,
      voice: undefined,
    };

    Voice.onSpeechStart = this._onSpeechStart;
    Voice.onSpeechEnd = this._onSpeechEnd;
    Voice.onSpeechResults = this._onSpeechResults;
    Voice.onSpeechError = this._onSpeechError;
  }
  render() {
    const { isRecord, voice } = this.state;
    const buttonLabel = isRecord ? 'Stop' : 'Start';
    const voiceLabel = voice
      ? voice
      : isRecord
      ? 'Say something...'
      : 'press Start button';
    return (
      <Container>
        <VoiceText>{voiceLabel}</VoiceText>
        <ButtonRecord onPress={this._onRecordVoice} title={buttonLabel} />
      </Container>
    );
  }
  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  private _onSpeechStart = event => {
    console.log('onSpeechStart');
    this.setState({
      voice: '',
    });
  };
  private _onSpeechEnd = event => {
    console.log('onSpeechEnd');
    /*axios.post('http://49.50.166.13:5000/CSR',{
      end: 'end',
      request: this.state.voice
    });*/
  };
  private _onSpeechResults = event => {
    console.log('onSpeechResults');
    this.setState({
      voice: event.value[0],
    });
    //string msg = 
    axios.post('http://49.50.166.13:5000/CSR',{
      clientId: 1,  
      result: 'res',
      request: this.state.voice
    });
  };
  private _onSpeechError = event => {
    console.log('_onSpeechError');
    console.log(event.error);
  };

  private _onRecordVoice = () => {
    const { isRecord } = this.state;
    if (isRecord) {
      Voice.stop();

    } else {
      //Voice.start('en-US');
      Voice.start('ko-KR');
      
      axios.get('http://49.50.166.13:5000/');

    }
    this.setState({
      isRecord: !isRecord,
    });
  };
}
