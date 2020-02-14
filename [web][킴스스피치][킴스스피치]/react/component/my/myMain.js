import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import profileImg from '../../image/profile.jpg';
import Paper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import SchoolIcon from '@material-ui/icons/School';
import TranslateIcon from '@material-ui/icons/Translate';
const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '100%',
	},
	topContent: {
		background: 'linear-gradient(180deg, #0984e3 30%, #6c5ce7 90%)',
		boxSizing: 'border-box',
		padding: '3rem 0 0 0',
		width: '100%',
		color: 'white',
		textAlign: '-webkit-center',
		height: '23rem',
	},
	topContentText: {
		fontSize: '1.5rem',
		margin: ' 0.5rem 0 0 0',
		color: '#ecf0f1',
		fontWeight: 'bold',
	},
	avatar: {
		width: '6rem',
		height: '6rem',
		margin: '0 1.5rem 0 0'
	},
	cardPaper: {
		display: 'flex',
		margin: '1.5rem 0 0 0',
		height: '8rem',
		width: '100%',
		textAlign: 'center'
	},
	card: {
		width: '44%',
		display: 'flex',
		marginRight: '3%',
		marginLeft: '3%',
	},
	cardLeft: {
		width: '50%',
		textAlign: 'center',
		fontSize: '2rem',
		fontWeight: 'bold',
		lineHeight: '8rem'
	},
	cardRight: {
		width: '50%',
		textAlign: 'center'
	},
	icon: {
		fontSize: '3rem',
		margin: '2rem 0 0.2rem 0',
		textAlign: 'center'
	},
	iconText: {
		fontSize: '1rem',
		fontWeight: 'bold'
	}
});
const MyMain = () => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<div className={classes.topContent}>
				<div>
					<Avatar alt="Remy Sharp" src={profileImg} className={classes.avatar} />
				</div>
				<div >
					<div className={classes.topContentText}>이홍기</div>
					<div style={{ display: 'inline-flex', marginTop: '2rem'}}>
						<SchoolIcon style={{ color: '#4cd137', fontSize: '5rem', marginRight: '1rem'}} />
						<div style={{lineHeight:'5rem', fontSize: '1.3rem', fontWeight:'bold'}}>
							중상위 (Level 5)
						</div>
					</div>
				</div>
			</div>
			<div className={classes.cardPaper}>
				<Paper className={classes.card} elevation={3}>
					<div className={classes.cardLeft}>
						3
					</div>
					<div className={classes.cardRight}>
						<ImportContactsIcon className={classes.icon} style={{ color: '#16a085' }} />
						<div className={classes.iconText}>
							연습중
						</div>
					</div>
				</Paper>
				<Paper className={classes.card} elevation={3}>
					<div className={classes.cardLeft}>
						10
					</div>
					<div className={classes.cardRight}>
						<CheckCircleIcon className={classes.icon} style={{ color: '#2980b9' }} />
						<div className={classes.iconText}>
							연습 완료
						</div>
					</div>
				</Paper>
			</div>
			<div className={classes.cardPaper}>
				<Paper className={classes.card} elevation={3}  >
					<div className={classes.cardLeft}>
						87
					</div>
					<div className={classes.cardRight}>
						<EqualizerIcon className={classes.icon} style={{ color: '#c0392b' }} />
						<div className={classes.iconText}>
							평균 점수
						</div>
					</div>
				</Paper>
				<Paper className={classes.card} elevation={3} >
					<div className={classes.cardLeft}>
						2.3h
					</div>
					<div className={classes.cardRight}>
						<AccessTimeIcon className={classes.icon} style={{ color: '#8e44ad' }} />
						<div className={classes.iconText}>
							총 연습 시간
						</div>
					</div>
				</Paper>
			</div>
			<div className={classes.cardPaper}>
				<Paper className={classes.card} elevation={3}  >
					<div className={classes.cardLeft}>
						영어
					</div>
					<div className={classes.cardRight}>
						<TranslateIcon className={classes.icon} style={{ color: '#2c3e50' }} />
						<div className={classes.iconText}>
							주 연습 언어
						</div>
					</div>
				</Paper>
				<Paper className={classes.card} elevation={3} >
					<div className={classes.cardLeft}>
						5.1h
					</div>
					<div className={classes.cardRight}>
						<AccessTimeIcon className={classes.icon} style={{ color: '#d35400' }} />
						<div className={classes.iconText}>
							총 이용 시간
						</div>
					</div>
				</Paper>
			</div>
			<br/>
			<br/>
		</div>
	)
}
export default MyMain;