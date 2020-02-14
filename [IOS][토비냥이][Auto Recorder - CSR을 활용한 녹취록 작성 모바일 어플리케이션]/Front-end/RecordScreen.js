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
import TrainingScreen from './TrainingScreen';
import Record from './Record';


class RecordScreen extends React.Component {
    constructor(props) {
        super(props)
        this.recording = null;
        this.sound = null;
        
    }
    componentDidMount(){
        this.recording = new Record();
        this.recording.startRecording();
        return;
    }

    _onButtonPress = () => {
        this.recording.stopRecording();
        
        this.props.navigation.navigate('ResultScreen',{
            recording:this.recording,
        })
        return;
    }
    

    render() {
        return (
            
            <View style={styles.container}>
                <Text>녹음중입니다...</Text>
                <View style={styles.pressRecordButtonContainer}>

                    <TouchableOpacity
                        style={styles.pressRecordButton} onPress={this._onButtonPress}
                         title="" >
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
        justifyContent: 'center',
    },
    pressRecordButton: {
        backgroundColor: 'red',
        height: 45,
        width: 45,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'


    },
    pressRecordButtonContainer: {
        position: 'absolute',
        top: (Math.round(Dimensions.get('window').height) / 1.45),
        left: (Math.round(Dimensions.get('window').width) / 2) - 45,

        height: 90,
        width: 90,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 60,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        opacity: 1
    },



});


export default RecordScreen