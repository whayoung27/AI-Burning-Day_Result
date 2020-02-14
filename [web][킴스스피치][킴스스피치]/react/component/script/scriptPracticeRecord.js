import React, { useState, useEffect,useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import StopIcon from "@material-ui/icons/Stop";
import Paper from "@material-ui/core/Paper";
import ReactRecord from "react-record";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
const useStyles = makeStyles({
  root: {
    position: "fixed",
    borderTop: "1px solid #ddd",
    background: "#ffffff",
    borderRadius: "50%",
    left: "50%",
    margin: "0 auto",
    bottom: "5rem",
    height: "5rem",
    zIndex: "1",
    width: "5rem",
    transform: "translate(-50%, 0%)"
  },
  button: {
    color: "#c0392b",
    textAlign: "center",
    lineHeight: "5rem",
    margin: "1.5rem 0 0 0"
  },
  content: {
    color: "black",
    margin: "1rem 0 0 0"
  },
  answerWord:{
    color: "blue"
  },
  rightWord:{
    color: "black",
  },
  wrongWord:{
    color: "red",
  },
  loading:{
		width:'100%',
		textAlign:'center',
	},
	loadingText:{
		fontSize: '1rem',
		height: '2rem',
		margin: '2rem 0 0 0',
		lineHeight: '2rem',
		fontWeight: 'bold',
  },
  recordText:{
    fontSize: '1rem',
		fontWeight: 'bold',
    position: "fixed",
    borderTop: "1px solid #ddd",
    background: "#ffffff",
    borderRadius: "50%",
    left: "50%",
    margin: "0 auto",
    bottom: "10rem",
    height: "2rem",
    zIndex: "1",
    textAlign: "center",
    width: "10rem",
    transform: "translate(-50%, 0%)"
  }
});
const ScriptPracticeRecord = props => {
  useEffect(() => {
    sentenceRef.current = props.sentence;
    scriptIDRef.current = props.scriptID;
    sentenceIDRef.current = props.sentenceID;
    scriptLanRef.current = props.scriptLan;
  },[props])
  const [isStart, setIsStart] = useState(false);
  const [blobURL, setBlobURL] = useState(null);
  const [blobObject, setBlobObject] = useState(null);
  const [open, setOpen] = useState(false);
  const [recordResult, setRecordResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [spokenSentence, setSpokenSentence] = useState('');
  var recordRef = useRef(null);
  var sentenceRef = useRef(null);
  var sentenceIDRef = useRef(null);
  var scriptIDRef = useRef(null);
  var scriptLanRef = useRef(null);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setIsLoading(true);
    setOpen(false);
  };

  const handleClick = () => {
    props.onClick();
    if (isStart){
      handleOpen();
    }
    setIsStart(!isStart);
  };
  const onData = recordedBlob => {
    
  };

  const onSave = blobObject => {
    
  };

  const onStop = blobObject => {
    setBlobURL(blobObject.blobURL);
    setBlobObject(blobObject);
    var formData = new FormData();
    formData.append("blobFile", blobObject.blob);
    formData.append("sentence", sentenceRef.current);
    formData.append("scriptID", scriptIDRef.current);
    formData.append("sentenceID", sentenceIDRef.current);
    formData.append("LAN",scriptLanRef.current);
    formData.append("isPractice", true)
    console.log(scriptLanRef.current)
    return axios
      //.post("https://kims-speech.herokuapp.com/script/score-practice", formData)
      .post("http://localhost:5050/script/score-practice", formData)
      .then(res => {
        console.log(res);
        setRecordResult(res.data.result);
        setIsLoading(false);
        setSpokenSentence(res.data.spokenString);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const onStart = () => {

  };
  const classes = useStyles();
  return (
    <div>
      <ReactRecord
        record={isStart}
        onStop={onStop}
        onStart={onStart}
        onSave={onSave}
        onData={onData}
      />
      {isStart ? (
        <div className={classes.recordText}>
        녹음중입니다.
        </div>
      ):(
        null
      )}
      <Paper elevation={3} className={classes.root} onClick={handleClick}>
        {isStart ? (
          <div className={classes.button}>
            <StopIcon fontSize="large" />
          </div>
        ) : (
          <div className={classes.button}>
            <FiberManualRecordIcon fontSize="large" />
          </div>
        )}
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        {isLoading?(
          <div>
            <DialogTitle>{"채점중.."}</DialogTitle>
            <DialogContent>
            <div className ={classes.loading}>	
              <CircularProgress/>
              <div className={classes.loadingText}>
                채점중입니다. 잠시만 기다려주세요. (최대 1분)
              </div>
            </div>
            </DialogContent>
          </div>
        ):(
          <div>
            <DialogTitle>{"연습 결과입니다"}</DialogTitle>
            <DialogContent>
            <DialogContentText>
              <div className={classes.content} style={{ margin: 0 }}>
                입력 : 
                <span className={classes.rightWord}>
                  {spokenSentence}
                </span>  
              </div>
              <div className={classes.content}>
                <audio ref={recordRef} controls="controls" src={blobURL}>
                  <track kind="captions" />
                </audio>
              </div>
              <div className={classes.content}>
                정답 : 
                {recordResult.map(result => (
                  result.rating==1 ? (
                  <span key ={result.original} className={classes.rightWord}>
                    {" "+ result.original}
                  </span>  
                  ):(
                    <span key ={result.original} className={classes.wrongWord}>
                    {" "+ result.original}
                  </span>  
                  )
                ))}
              </div>
              <div className={classes.content}>
                <audio ref={recordRef} controls="controls"  src={props.url}>
                  <track kind="captions" />
                </audio>
              </div>
            </DialogContentText>
            </DialogContent>
          </div>
        )}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ScriptPracticeRecord;
