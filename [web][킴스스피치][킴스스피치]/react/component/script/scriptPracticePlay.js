import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import Paper from '@material-ui/core/Paper';
const useStyles = makeStyles({
  root: {
    position: 'fixed',
    borderTop: '1px solid #ddd',
    background: '#ffffff',
    borderRadius: '50%',
    left: '50%',
    margin: '0 auto',
    bottom: '5rem',
    height: '5rem',
    zIndex: '1',
    width: '5rem',
    transform: 'translate(-50%, 0%)'
  },
  button: {
    color: '#c0392b',
    textAlign: 'center',
    lineHeight: '5rem',
    margin: '1.5rem 0 0 0'
  }
});
const ScriptPracticePlay = (props) => {
  const [isStart, setIsStart] = useState(false);
  const handleClick = () => {
    props.onClick();
    setIsStart(!isStart);
    if(isStart){
      playRef.current.pause();
    }else{
      playRef.current.play();
    }
  };
  const handlePlayEnd = () =>{
    handleClick();
  }
  var playRef = useRef(null);
  const classes = useStyles();
  return (
    <div>
      <Paper elevation={3} className={classes.root} onClick={handleClick}>
        {
          isStart
            ?
            <div className={classes.button} >
              <StopIcon fontSize='large' />
            </div>
            :
            <div className={classes.button}>
              <PlayArrowIcon fontSize='large' />
            </div>
        }
      </Paper>
      <audio
        style={{display:'none'}}
        ref={playRef}
        controls="controls"
        src={props.url}
        onEnded  ={handlePlayEnd}>
        <track kind="captions" />
    	</audio>
    </div>
  )
}
export default ScriptPracticePlay;