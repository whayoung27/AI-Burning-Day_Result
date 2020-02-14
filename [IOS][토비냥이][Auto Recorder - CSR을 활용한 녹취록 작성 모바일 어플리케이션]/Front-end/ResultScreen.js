import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, ActivityIndicator, Slider } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

class Stt extends React.Component {
    constructor(props) {
        super(props);
        this.header = this.props.header;
        this.body = this.props.body;
    }
    render() {
        return (
            <View style={styles.sttBox}>
                <View >
                    <Text>
                        {this.header}
                    </Text>
                </View>
                <View>
                    <Text>
                        {this.body}
                    </Text>
                </View>

            </View>
        )
    }
}



class ResultScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            haveRecordingPermissions: false,
            isLoading: false,
            isPlaybackAllowed: false,
            muted: false,
            soundPosition: null,
            soundDuration: null,
            recordingDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isRecording: false,
            fontLoaded: false,
            shouldCorrectPitch: true,
            volume: 1.0,
            rate: 1.0,
        }
        this.isSeeking = false;
        this.navigation = this.props.navigation;
        this.record = this.navigation.getParam('recording', 'default');
        this.recording = this.record.recording;
        // this.record.sound = this.record.sound;
        this.response = null;
        this.body = null;


    }

    async componentDidMount() {
        await this._sendRecordingFile();
        // this.download();
        this._createSound();
        return;
    }
    _createSound = async () => {
        const { sound, status } = await this.record.recording.createNewLoadedSoundAsync(
            {
                isLooping: true,
                isMuted: this.state.muted,
                volume: this.state.volume,
                rate: this.state.rate,
                shouldCorrectPitch: this.state.shouldCorrectPitch,
            },
            this._updateScreenForSoundStatus
        );
        this.record.sound = sound;
    }
    _updateScreenForSoundStatus = status => {
        if (status.isLoaded) {
            this.setState({
                soundDuration: status.durationMillis,
                soundPosition: status.positionMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                rate: status.rate,
                muted: status.isMuted,
                volume: status.volume,
                shouldCorrectPitch: status.shouldCorrectPitch,
                isPlaybackAllowed: true,
            });
        } else {
            this.setState({
                soundDuration: null,
                soundPosition: null,
                isPlaybackAllowed: false,
            });
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    };

    _sendRecordingFile = async () => {
        var uri = this.recording['_uri'];
        let data = new FormData();

        data.append("audio", {
            uri,
            name: 'record.caf',
            type: 'audio/caf',
        });

        let options = {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            }
        };

        try {
            this.response = await fetch("http://10.83.32.252:3000/voice", options);
            this.body = await this.response.json();
            console.log(body);
            this.setState({ isLoading: false });
            console.log("RESOPONSE!!!!!!!!!!")
            return;
        } catch (error) {
            console.log(error);
        }
    }
    _loadingAction = () => {
        return (
            <View style={{ width: 300, height: 100 }}>
                <ActivityIndicator size="large" />
                <Text>녹음파일을 분석중입니다...</Text>
            </View>
        )
    }
    _screen = () => {
        return (
            <View style={{ width: 300, height: 100, }}>
                {/* <Text>{this.body.text}</Text> */}
            </View>
        )
    }
    _onPressPlayButton = () => {
        if (this.state.isPlaying) {
            this.setState({ isPlaying: false });
            this._pauseSound();
        } else {
            this.setState({ isPlaying: true });
            this._playSound();
        }

    }
    _pauseSound = async () => {
        this.record.sound.pauseAsync();
    }
    _playSound = async () => {
        this.record.sound.playAsync();
    }


    _onSeekSliderValueChange = value => {
        if (this.record.sound != null && !this.isSeeking) {
            this.isSeeking = true;
            this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
            this.record.sound.pauseAsync();
        }
    };

    _onSeekSliderSlidingComplete = async value => {
        if (this.record.sound != null) {
            this.isSeeking = false;
            const seekPosition = value * this.state.soundDuration;
            if (this.shouldPlayAtEndOfSeek) {
                this.record.sound.playFromPositionAsync(seekPosition);
            } else {
                this.record.sound.setPositionAsync(seekPosition);
            }
        }
    };




    _getSeekSliderPosition() {
        if (
            this.record.sound != null &&
            this.state.soundPosition != null &&
            this.state.soundDuration != null
        ) {
            return this.state.soundPosition / this.state.soundDuration;
        }
        return 0;
    }
    render() {

        // this._updateScreenForSoundStatus();
        return (
            <View style={styles.container}>
                <ScrollView style={styles.sttContainer}>
                    {this.state.isLoading ? this._loadingAction() : this._screen()}
                    <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

Where can I get some?
There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
</Text></ScrollView>
                <View style={styles.playContainer}>

                    <TouchableOpacity onPress={this._onPressPlayButton}>
                        <AntDesign name={this.state.isPlaying ? "pausecircleo" : "playcircleo"} size={70} color='black' />
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    container: {

        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sttContainer: {
        flex: 4,
        flexGrow: 3,
        paddingLeft: 10,
        paddingRight: 10,
        height: 650,
        borderBottomWidth: 1,
        borderColor: 'black',


    },
    playContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        flex: 1,
    }

});


export default ResultScreen