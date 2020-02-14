import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@material-ui/icons/Description';
import PhotoIcon from '@material-ui/icons/Photo';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
const useStyles = makeStyles({
	root: {
  },
  title: {
    width: '100%',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  content:{
		margin: '1rem 0 0 0',
		
	},
	button:{
		width: '32%',
		fontSize: '1rem',
    fontWeight: 'bold',
		margin: '2rem 1% 0 0',
		height: '10rem',
		textAlign: 'center'
	},
	icon: {
		fontSize: '3rem',
		margin: '0.2 0 0.2rem 0',
		textAlign: 'center'
	},
});
const UploadMain = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
      <div className={classes.title}>업로드 방법 선택</div>
			<div className={classes.content}>
				<Button className={classes.button}  color="primary" component={Link} to="/uploadDirect" >
					<div style={{ color: '#c0392b' }}>
						<DescriptionIcon className={classes.icon}/>
						<div>직접 작성</div>
					</div>
				</Button>
				<Button className={classes.button} color="primary">
					<div style={{ color: '#16a085' }}> 
						<InsertDriveFileIcon className={classes.icon}/>
						<div>파일 업로드</div>
					</div>
				</Button>
				<Button className={classes.button} color="primary">
					<div style={{ color: '#2980b9' }}  >
						<PhotoIcon className={classes.icon}/>
						<div>사진 업로드</div>
					</div>
				</Button>
			</div>
		</div>
	)
}
export default UploadMain;
