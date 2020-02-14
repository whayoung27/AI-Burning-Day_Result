import React, {Component} from 'react';
import axios from 'axios';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
//import mainImage from './images/mainImage.png';

const LOCAL_HOST = 'http://localhost:5000'
const SERVER_HOST = 'http://49.50.166.13:5000'

const NOW_HOST = SERVER_HOST

class WngMain extends Component {
    state = {
        cliId: '',
        file: undefined,
        src: '',
        capture: undefined
    }

    componentDidMount() {
        const _RANDOM_RANGE_ = 10000
        const randomVal = Math.floor(Math.random() * _RANDOM_RANGE_) + 1
        const msVal = new Date().getMilliseconds();
        const cliId = randomVal*_RANDOM_RANGE_+msVal

        this.setState({
            cliId: cliId
        });
    }

    changeFile = (evt) => {
        this.setState({
            file: evt.target.files[0]
        });
    }

    dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        console.log('bstr', bstr);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    dataURItoBlob = (dataURI) => {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});    
    }

    handleTakePhoto = (evt) => {
        const atob = require('atob');

        //const dataArr = evt.split(',')
        //console.log(atob(dataArr[1]));

        this.setState({
            src: evt
        })

        //const file = this.dataURLtoFile(evt, 'test.png');
        //console.log(file);
        //let blobImage = new Blob([file], {type: 'image/png'});
        //console.log('blob', blobImage);

        const file = this.dataURItoBlob(evt);
        console.log('file tt', file);
        this.setState({
            capture: file
        });
    }

    imgSend = (evt) => {
        console.log(this.state.capture);
        if (this.state.capture != undefined) {
            let formData = new FormData();
            formData.set('cliId', this.state.cliId);
            console.log('formdata', this.state.capture);
            formData.append('image', this.state.capture);
            axios.post(NOW_HOST + "/api/upload", formData)
            .then(res => {
                const statusCode = res.status;
                if (statusCode == 200) {
                    setTimeout(()=>{
                        const curFormData = new FormData();
                        curFormData.set('cliId', this.state.cliId);
                        axios.post(NOW_HOST+"/OD2", curFormData)
                        .then(res => {
                            if (res.status == 200) {
                                const audioData = res.data;
                                console.log('audioData import success');
                                this.setState({
                                    src: NOW_HOST + '/static/audios/'+audioData+'.mp3'
                                });
                            }
                        })
                        .catch(err => console.warn(err));
                    }, 1);
                }
            })
            .catch(err => console.warn(err));
        }
    }

    render() {
        const style = {
            WngWrap: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            },
            sendBtn : {
                backgroundColor: 'white',
                width: '50%',
                height: '50%'
            },
            preview: {
                position: 'relative',
            },
            captureContainer: {
                display: 'flex',
                position: 'absolute',
                justifyContent: 'center',
                zIndex: 1,
                bottom: 0,
                width: '100%'
            },
            captureButton: {
                backgroundColor: '#fff',
                borderRadius: '50%',
                height: 56,
                width: 56,
                color: '#000',
                margin: 20
            },
            captureImage: {
                width: '100%',
            },
            audioTag: {
                visibility: 'hidden'
            },
            realTime: {
                width: '30px',
                height: '30px'
            },
            sendBtn: {
                marginTop: '1.5rem',
                padding: '1rem 2rem',
                borderRadius: '5px',
                backgroundColor: 'transparent'
            }
        }
        return (
            <div className="WngWrap" style={style.WngWrap}>
                <div id='bg'/>
                <div id='overlay'/>
                <Camera
                    onTakePhoto = {(dataUri) => { this.handleTakePhoto(dataUri); } }
                    style={style.realTime}
                />
                {
                    //<input type='file' onChange={this.changeFile}/>
                }
                <button style={style.sendBtn} onClick={this.imgSend}>동 행</button>
                {
                    /*
                    <input type='text' readOnly value={this.state.cliId}/>
                    <input type='text' readOnly value={escape(this.state.capture)}/>
                    */
                }
                
                <audio style={style.audioTag} src={this.state.src} width='400' controls autoPlay>
                    해당 브라우저는 태그를 지원하지 않아요~
                </audio>
                {
                    // <img src={this.state.src} />
                }
                
            </div>
        );
    }
}

export default WngMain;