import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactRecord from 'react-record';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
const useStyles = makeStyles({
	root: {
	},
	title: {
		height: '2rem',
	},
	titleIcon: {
		height: '2rem',
		float: 'left'
	},
	titleText: {
		fontSize: '1rem',
		height: '2rem',
		lineHeight: '2rem',
		fontWeight: 'bold',
		margin: '0 0 0 1rem',
		float: 'left'
	},
	contentTitle: {
		fontSize: '1rem',
		lineHeight: '2rem',
		fontWeight: 'bold',
		margin: '1rem 0 0.5rem 0'
	},
	content: {
		fontSize: '1rem',
		lineHeight: '1.7rem',
		margin: '0 0 0 0.5rem'
	},
	timer: {
		fontSize: '1rem',
		textAlign: 'center',
		clear: 'both',
		lineHeight: '2rem',
		margin: '1rem 0 0 0'
	},
	popupContent: {
    color: 'black',
    margin: '1rem 0 0 0'
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
	}
});
const ScriptPresentation = () => {
	const [isStart, setIsStart] = useState(false);
	const [blobURL, setBlobURL] = useState(null);
  const [blobObject, setBlobObject] = useState(null);
	const [time, setTime] = useState(0);
	const [practicePoint, setPracticePoint] = useState(0);
	const [practiceTime, setPracticeTime] = useState(0);
	const [open, setOpen] = React.useState(false);
	const [scriptTitle, setScriptTitle] = useState('');
	const [sentence, setSentence] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	var sentenceRef = useRef(null);
	var scriptIDRef = useRef(null);
	var recordRef = useRef(null);
	var scriptLanRef = useRef(null);
	var intervalRef = useRef(null);
	useEffect(() => {
		const params = new URLSearchParams(location.hash.split('?')[1]);
		var id=0;
		var title ='';
		var lan = '';
		for (let p of params) {
			if (p[0]==='id'){
				id = Number(p[1]);
			}else if (p[0]==='title'){
				title = p[1]; 
			}else if (p[0]==='lan'){
				lan = p[1]; 
			}
		}
		setScriptTitle(title);
		scriptIDRef.current = id;
		scriptLanRef.current = lan;
		axios
			//.get("https://kims-speech.herokuapp.com/script/"+id)
			.get("http://localhost:5050/script/"+id)
      .then(res => {
				if (res.data.length>0){
					setSentence(res.data[0].SCRIPT);
					sentenceRef.current = res.data[0].SCRIPT;
				}
      })
      .catch(err => {
        console.log(err);
      });
	},[])
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		setPracticeTime(0);
		setPracticePoint(0);
	};
	const handleStartClick = (e) => {
		setIsStart(true);
		intervalRef.current = setInterval(() => {
			setTime(time => time + 1);
		}, 1000);

	};
	const handleFinishClick = (e) => {
		handleOpen();
		handleRefreshClick();
	};
	const handleRefreshClick = (e) => {
		setIsStart(false);
		clearInterval(intervalRef.current);
		setPracticeTime(time);
		setTime(0);
	};
	const onData = recordedBlob => {

  }
  const onSave = blobObject => {

  };
  const onStop = blobObject => {
    setBlobURL(blobObject.blobURL);
    setBlobObject(blobObject);
    var formData = new FormData();
    formData.append("blobFile", blobObject.blob);
		formData.append("sentence", sentenceRef.current);
		formData.append("scriptID", scriptIDRef.current);
		formData.append("LAN",scriptLanRef.current);
		formData.append("isPractice", false);
    return axios
      //.post("https://kims-speech.herokuapp.com/script/score-practice", formData)
      .post("http://localhost:5050/script/score-practice", formData)
      .then(res => {
        console.log(res);
				var point =0;
				for (var i=0; i<res.data.result.length; i++){
					point += res.data.result[i].rating/res.data.result.length*100;
				}
				setPracticePoint(Math.floor(point));
				setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const onStart = () => {
  };
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<ReactRecord record={isStart} onStop={onStop} onStart={onStart} onSave={onSave} onData={onData} />
			<div className={classes.title}>
				<Button className={classes.titleIcon} component={Link} to="/script"><ArrowBackIcon /></Button>
				<div className={classes.titleText}>실전</div>
				<div style={{ float: "right" }}>
					{
						!isStart
							?
							<Button variant="contained" color="primary" onClick={handleStartClick} style={{ height: "2rem", margin: "0 0.5rem 0 0" }}>시작</Button>
							:
							<div>
								<Button variant="contained" color="primary" onClick={handleRefreshClick} style={{ height: "2rem", margin: "0 0.5rem 0 0" }}>초기화</Button>
								<Button variant="contained" color="primary" onClick={handleFinishClick} style={{ height: "2rem", margin: "0 0.5rem 0 0" }}>완료</Button>
							</div>
					}
				</div>
			</div>
			<div className={classes.timer}>
				발표시간 : {time} 초
			</div>
			<div className={classes.contentTitle}>
				{scriptTitle}
			</div>
			<span >
				<span className={classes.content}>
					{sentence}
				</span>
			</span>
			<Dialog open={open} onClose={handleClose} >
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
					<DialogTitle>{'실전 결과입니다'}</DialogTitle>
					<DialogContent>
						<DialogContentText>
						<div className={classes.content} style={{ margin: 0 }}>
							실전 점수는 {practicePoint}점이고 총 소요 시간은 {practiceTime}초입니다.
						</div>
						<div className={classes.popupContent}>
							<audio ref={recordRef} controls="controls" src={blobURL}>
								<track kind="captions" />
							</audio>
						</div>	
						</DialogContentText>
					</DialogContent>
				</div>
			)}

				<DialogActions>
					<Button onClick={handleClose} color="primary" autoFocus>
						확인
          </Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
export default ScriptPresentation;