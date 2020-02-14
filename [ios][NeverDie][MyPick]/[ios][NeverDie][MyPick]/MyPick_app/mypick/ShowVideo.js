import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import {
  Card,
  CardItem,
  Thumbnail,
  Container,
  Header,
  Content,
  Icon,
  Accordion,
  Left,
  Body,
  Title,
  Right,
  Button,
} from 'native-base';
import { Video } from 'expo-av';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

class ShowVideo extends Component {
  state = {
    mute: false,
    shouldPlay: true,
  };

  handlePlayAndPause = () => {
    this.setState(prevState => ({
      shouldPlay: !prevState.shouldPlay,
    }));
  };

  handleVolume = () => {
    this.setState(prevState => ({
      mute: !prevState.mute,
    }));
  };

  render() {
    const { navigation } = this.props;
    const video_url = navigation.getParam('video_url');
    return (
      <Container>
        <Container
          style={{
            flex: 1,
            backgroundColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Video
            source={{
              uri: video_url,
            }}
            shouldPlay={this.state.shouldPlay}
            resizeMode="cover"
            style={{ width: 420, height: 250 }}
            isMuted={this.state.mute}
            inFullscreen={true}
          />
          <View style={styles.controlBar}>
            <MaterialIcons
              name={this.state.mute ? 'volume-mute' : 'volume-up'}
              size={45}
              color="white"
              onPress={this.handleVolume}
            />
            <MaterialIcons
              name={this.state.shouldPlay ? 'pause' : 'play-arrow'}
              size={45}
              color="white"
              onPress={this.handlePlayAndPause}
            />
          </View>
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  controlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ShowVideo;
