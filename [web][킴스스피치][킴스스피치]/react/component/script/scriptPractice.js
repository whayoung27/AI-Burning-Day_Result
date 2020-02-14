import React, {useEffect, useState}	 from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import ScriptPracticeRecord from './scriptPracticeRecord';
import ScriptPracticePlay from './ScriptPracticePlay';
import { Link } from 'react-router-dom';
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
		margin: '0 0 0 0.5rem',
		cursor: 'pointer'
	},
	contentHighlight: {
		fontSize: '1rem',
		background: 'yellow',
		lineHeight: '1.7rem',
		margin: '0 0 0 0.5rem',
		cursor: 'pointer'
	},
	
});
const PurpleSwitch = withStyles(theme => ({
	switchBase: {
		color: theme.palette.primary.main,
	},
}))(Switch);
const ScriptPractice = () => {
	const [activeIdx, setActiveIdx] = useState(0);
	const [activeSentence, setActiveSentence] = useState('');
	const [activeURL, setActiveURL] = useState('');
	const [isRecordMode, setIsRecordMode] = useState(false);
	const [isOnProgress, setIsOnProgress] = useState(false);
	const [sentenceList, setSentenceList] = useState([]);
	const [scriptID, setScriptID] = useState(0);
	const [scriptTitle, setScriptTitle] = useState('');
	const [scriptLan, setScriptLan] = useState('');
	useEffect(() => {
		const params = new URLSearchParams(location.hash.split('?')[1]);
		console.log(params);
		var id=0;
		var title ='';
		var lan ='';
		for (let p of params) {
			if (p[0]==='id'){
				id = Number(p[1]);
			}else if (p[0]==='title'){
				title = p[1]; 
			}else if (p[0]==='lan'){
				lan = p[1]; 
			}
		}
		setScriptID(id);
		setScriptTitle(title);
		setScriptLan(lan);
		console.log(lan);
		axios
			//.get("https://kims-speech.herokuapp.com/script/"+id)
			.get("http://localhost:5050/script/"+id)
      .then(res => {
        console.log(res.data);
				setSentenceList(res.data);
				if (res.data.length>0){
					setActiveSentence(res.data[0].SENTENCE);
					setActiveURL(res.data[0].AUDIO_FILENAME);
				}
      })
      .catch(err => {
        console.log(err);
      });
  },[])
	const handleChange = () => {
		if (!isOnProgress)
			setIsRecordMode(!isRecordMode);
	};
	const handleClick = (idx, sentence, url) => {
		if (!isOnProgress) {
			setActiveSentence(sentence);
			setActiveIdx(idx);
			setActiveURL(url);
		}
	};
	const handleProgress = () => {
		setIsOnProgress(!isOnProgress);
	}
	
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<div className={classes.title}>
				<Button className={classes.titleIcon} component={Link} to="/script"><ArrowBackIcon /></Button>
				<div className={classes.titleText}>연습</div>
				<div className={classes.titleText} style={{ float: "right", display: 'flex' }} color="primary">
					<div >듣기</div>
					<PurpleSwitch checked={isRecordMode} onChange={handleChange} color="default" />
					<div >녹음</div>
				</div>
			</div>
			<div className={classes.contentTitle}>
				{scriptTitle}
			</div>
			<span >
				{sentenceList.map(sentence => (
					sentence.IDX_IN_SCRIPT == activeIdx
						?
						<span className={classes.contentHighlight} key={sentence.IDX_IN_SCRIPT}>
							{sentence.SENTENCE + '.'}
						</span>
						:
						<span
							className={classes.content}
							key={sentence.IDX_IN_SCRIPT}
							idx={sentence.IDX_IN_SCRIPT}
							onClick={() => handleClick(sentence.IDX_IN_SCRIPT, sentence.SENTENCE,sentence.AUDIO_FILENAME)}>
							{sentence.SENTENCE + '.'}
						</span>
				))}
			</span>
			<div>
			{
				isRecordMode
					?
					<ScriptPracticeRecord
						url={activeURL}
						scriptID = {scriptID}
						sentenceID = {activeIdx}
						sentence={activeSentence}
						scriptLan = {scriptLan}
						onClick={handleProgress} />
					:
					<ScriptPracticePlay url={activeURL} onClick={handleProgress} />
			}
			</div>
		</div>
	)
}
export default ScriptPractice;