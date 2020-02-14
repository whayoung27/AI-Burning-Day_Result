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

const DATA = {
  'blackpink': {
    id: 'blackpink',
    title: '3주년💕',
    date: 'Feb 14, 2020',
    profile_img:
      'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052017/untitled-1_9.png?itok=3xjaxvLi',
    contents_url: 'https://i.imgur.com/jlErwF7.png',
    members: [
      {
        name: 'Jennie ONLY!💗',
        video_url: 'https://i.imgur.com/AtHbJeC.mp4',
      },
      {
        name: 'Lisa ONLY!💝',
        video_url: 'https://i.imgur.com/M0L50cE.mp4',
      },
      {
        name: 'Jisoo ONLY!💛',
        video_url: 'https://i.imgur.com/59SdtNp.mp4',
      },
      {
        name: 'Rose ONLY!❣',
        video_url: 'https://i.imgur.com/An4OpsO.mp4',
      },
    ],
  },
  'neverdie': {
    id: 'neverdie',
    title: 'Never die@@@@',
    date: 'Feb 13, 2020',
    profile_img: 'https://i.imgur.com/k94jwRt.jpg',
    contents_url:
      'https://i.pinimg.com/564x/2b/98/d8/2b98d826e278f203867a2277abc23850.jpg',
    members: [
      { name: 'Jeong mee ONLY!🎧', video_url: '' },
      { name: 'Ha Yeong ONLY!🎉', video_url: '' },
      { name: 'Jin Joo ONLY!🎀', video_url: '' },
      { name: 'Yu Jin ONLY!👑', video_url: '' },
    ],
  },
};

class ShowGroupList extends Component {
  render() {
    const { navigation } = this.props;
    const group_name = navigation.getParam('group_name');
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={{ alignItems: 'center' }}>BACK</Text>
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>My Pick!</Title>
          </Body>
          <Right/>
        </Header>
        <CardItem>
          <Left>
            <Thumbnail
              source={{
                uri: DATA[group_name].profile_img,
              }}
            />
            <Body>
              <Text style={styles.title}>{DATA[group_name].title}</Text>
              <Text note>{DATA[group_name].date}</Text>
            </Body>
          </Left>
        </CardItem>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Image
              source={{
                uri: DATA[group_name].contents_url,
              }}
              style={{ height: 200, width: null, flex: 1 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={DATA[group_name].members}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('ShowVideo', {
                        video_url: item.video_url,
                      })
                    }>
                    <Text style={styles.title}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    width: '95%',
    backgroundColor: '#fbd9c8',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold'
  },
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});

export default ShowGroupList;
