import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import { AntDesign } from '@expo/vector-icons';


class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.navigate = this.props.navigation;
        this.state = {
            usersNumber: 2,
        }
    }

    _minusUserCount = async () => {
        if (this.state.usersNumber > 1) {
            this.setState({
                usersNumber: this.state.usersNumber - 1
            })
        }
    }
    _plusUserCount = async () => {
        if (this.state.usersNumber < 5) {
            this.setState({
                usersNumber: this.state.usersNumber + 1
            })
        }
    }

    render() {
        return (
            
            <View style={styles.container}>
                <View style={{ top: -100 }}>
                    <Text style={styles.mainTextContainer}>녹음인원 설정</Text>
                    <View style={styles.userCountSetting}>
                        <TouchableOpacity onPress={this._minusUserCount} title="" >
                            <AntDesign name="minuscircleo" size={52} color='black' />
                        </TouchableOpacity>

                        <Text style={styles.countingNumber}> {this.state.usersNumber} </Text>
                        <TouchableOpacity onPress={this._plusUserCount} title="" >
                            <AntDesign name="pluscircleo" size={52} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.button} onPress={() => this.props.navigation.navigate('TrainingScreen', {
                            number : this.state.usersNumber,
                        })}
                          ><Text 
                          style={styles.checkButton}>확인</Text>
                              
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCountSetting: {
        justifyContent: 'space-around',
        display: 'flex',
        flexDirection: 'row'
    },
    countingNumber: {
        fontSize: 40,
        marginLeft: 35,
        marginRight: 35

    },

    mainTextContainer: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 100

    },
    button: {
        width:75,
        height:45,
        backgroundColor:'#f7e9f0',
        borderRadius:5,
        borderWidth: 1,

        borderColor: 'black',
        justifyContent:'center',
        alignItems: 'center'
    },
    checkButton: {
        fontSize:30,
        
        }

});





export default HomeScreen;