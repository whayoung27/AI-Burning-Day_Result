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

class Record {
    constructor(props) {
        this.recording = null;
        this.sound = null;
        this.isSeeking = false;
        this.shouldPlayAtEndOfSeek = false;
        this.haveRecordingPermissions = false;
        this.volume = 1.0;
        this.rate = 1.0;
        this.muted = false;
        this.shouldCorrectPitch = true;
        this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
        this.Audio = Audio

    }
    _askForPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.haveRecordingPermissions = response.status === 'granted';

    };
    startRecording = async () => {
        this._askForPermissions();
        console.log("RUN RECORDING!!!!!!!!")
        await this.Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
        });
        if (this.recording !== null) {
            this.recording.setOnRecordingStatusUpdate(null);
            this.recording = null;
        }
        const recording = new Audio.Recording();
        try {
            await recording.prepareToRecordAsync(this.recordingSettings);
            recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

            this.recording = recording;
            await this.recording.startAsync();
        } catch (error) {
            // An error occurred!
            console.log(error)
        }
    }

    stopRecording = async () => {
        console.log("STOP RECORDING!!!!!!!!")
        console.log('zero');
        try {
            await this.recording.stopAndUnloadAsync();
        } catch (error) {
            console.log(error)
        }
        console.log('one');
        //console.log(`FILE INFO: ${JSON.stringify(info)}`);
        await this.Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            playsInSilentLockedModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
        });
        console.log('two');
        const { sound, status } = await this.recording.createNewLoadedSoundAsync(
            {
                isLooping: true,
                isMuted: this.muted,
                volume: this.volume,
                rate: this.rate,
                shouldCorrectPitch: this.shouldCorrectPitch,
            },
            this._updateScreenForSoundStatus
        );
        console.log('three');
        this.sound = sound;
        
        /*

    }*/



        //this.sound.playAsync();
    }

}

export default Record