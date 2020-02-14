import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Animated,
    Dimensions
}
    from 'react-native';

import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import { AntDesign } from '@expo/vector-icons';
import Record from './Record';
const usersData = {

}
var globalCounting = 0;
var globalNumber = 0;

class TrainingFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRecording: false,
            isFinishing: false,
        }
        this.recording = null;
        this.userId = this.props.id;
        this.counting = 0;
        this.buttonText = this.props.buttonText;
        this.navigation = this.props.navigation;
        this.last = this.props.total -1;
        usersData[this.userId] = [];

    }
    _sendRecordingFile = async () => {
        var uri = this.recording.recording['_uri'];
        var fileName = uri.split('.');
        var wavName = fileName[0].concat('.wav');
        usersData[this.userId].push(wavName);
        let data = new FormData();

        data.append("audio", {
            uri,
            name: 'record.caf',
            type: 'audio/caf',
        });
        //data.append("isFinish",this.state.isFinishing);
        //data.append("usersData",usersData);
        if(globalCounting >= globalNumber){
            data.append("isFinish",true);
        }else{
            data.append("isFinish",false);
        }
        
        data.append("userNumber",this.userId);
        data.append("last",this.last);
        //data.append("fileNames",usersData);

        let options = {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            }
        };


        try {
            let response = await fetch("http://10.83.32.252:3000/training", options);
            console.log("RESOPONSE!!!!!!!!!!")
        } catch (error) {
            console.log(error);
        }
    }
    _onPressRecordButton = () => {
        if (!(this.counting >= 3)) {
            if (!(this.state.isRecording)) {
                this.setState({ isRecording: true });
                this.buttonText = '녹음중';
                this.recording = new Record();
                this.recording.startRecording();

            } else {
                this.counting = this.counting + 1;
                this.recording.stopRecording();
                globalCounting = globalCounting + 1;

                
                this._sendRecordingFile();
                

                if (this.counting >= 3) {
                    this.setState({ isRecording: false });
                    this.buttonText = '녹음완료';
                    this.setState({ isFinishing: true});
                } else {
                    this.setState({ isRecording: false });
                    this.buttonText = '목소리 등록';
                }
            }

        }
    }
    render() {
        return (
            <View>
                <View style={{
                    width: (Math.round(Dimensions.get('window').width)),
                    justifyContent: 'space-around',
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: 20,
                    marginBottom: 20
                }} >
                    <Text style={{ fontSize: 50 }}>
                        {this.props.tempName}
                    </Text>
                    <TouchableOpacity style={this.state.isRecording ? styles.activeRecordButton : styles.trainingButton} onPress={this._onPressRecordButton}

                    >
                        <Animated.Text style={this.state.isRecording ? { fontSize: 15, color: 'white' } : { fontSize: 15, color: 'black' }}>
                            {this.buttonText}
                        </Animated.Text>
                        <Animated.Text>{this.counting}/3</Animated.Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


class TrainingScreen extends React.Component {
    constructor(props) {
        super(props);
        //this.UsersNumber = this.props.number,
        this.number = null;
        this.state = {
            isLoading: false,
            isRecording: false,
        }
        this.navigation = this.props.navigation
        this.number = this.navigation.getParam('number', 'default');
        this.frames = [];
    }
    _setTrainingButton() {
        globalNumber = this.number * 3;
        for (var i = 0; i < this.number; i++) {
            this.frames[i] = <TrainingFrame tempName={String.fromCharCode(65 + i)} buttonText='목소리 등록' id={i} total={this.number} />
        }

    }
    _onRecordPress = () => {
        this.navigation.navigate('RecordScreen');

    }

    render() {
        this._setTrainingButton();
        return (
            <View style={styles.container}>
                <View>{this.frames}</View>
                <View style={styles.recordButtonContainer}>
                    <TouchableOpacity
                        style={styles.recordButton}
                        onPress={this._onRecordPress} title="" >
                    </TouchableOpacity>
                </View>

            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {

        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    trainingButton: {
        width: 80,
        height: 55,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeRecordButton: {
        width: 80,
        height: 55,
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recordButtonContainer: {
        position: 'absolute',
        top: (Math.round(Dimensions.get('window').height) / 1.45),
        left: (Math.round(Dimensions.get('window').width) / 2) - 45,
    
        height: 90,
        width: 90,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        opacity: 1
      },
      recordButton: {
        backgroundColor: 'red',
        height: 80,
        width: 80,
        borderRadius: 50,
    
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      },
});

export default TrainingScreen