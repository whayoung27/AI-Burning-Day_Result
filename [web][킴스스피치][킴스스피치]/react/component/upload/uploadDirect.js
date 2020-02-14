import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useState } from 'react';
import { post } from 'axios';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = makeStyles(theme => ({
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
	button: {
		width: '20%',
		fontSize: '1rem',
		fontWeight: 'bold',
		margin: '2rem 20% 0 5%',
		height: '2rem'
	},
	input: {
		display: 'none',
	},
	content:{
		margin: '1rem 0 0 0',
		display: 'grid'
	},
	content2:{
		height: '26rem',
		margin: '1rem 0 0 0'
	},
	input:{

	}
}));
const UploadDirect = (props) => {
	const addScript = () => {
		//const url = 'https://kims-speech.herokuapp.com/script/upload';
		const url = 'http://localhost:5050/script/upload';
		const formData = [];
		formData[0] = new FormData();
		formData[1] = new FormData();
		formData[2] = new FormData();
		formData[0].append('title', title)
		formData[1].append('content', content)
		formData[2].append('lan', lan)
		const config = {
			headers: {
				'Content-Type': "application/json"
			}
		}
		const title_Array = title.split("nbnb");
		const sentence = content.split("nbnb");
		const script_all = title_Array.concat(sentence);
		const script_lan = [lan, script_all]
		return post(url, script_lan, config)
	}
	const [title, setTitle] = useState("");
	const [lang, setLang] = useState("");
	const [content, setContent] = useState("");
	const [lan, setLan] = React.useState('English');
	const handleSubmit = (evt) => {
		evt.preventDefault()
		addScript()
			.then((response) => {
				console.log(response.data);
				console.log(lan);
				location.href  = 'http://localhost:8080/#/script';
			})
		alert(`업로드되었습니다.`)
	}
	const handleChange = event => {
    setLan(event.target.value);
  };
	const classes = useStyles();
	return (
		<form  className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
			<div className={classes.title}>
				<Button className={classes.titleIcon} component={Link} to="/upload"><ArrowBackIcon /></Button>
				<div className={classes.titleText}>직접 작성</div>
				<div className={classes.titleText} style={{ float: "right", display: 'flex' }} color="primary">
				<Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
					value={lan}
					style={{width:'5rem'}}
          onChange={handleChange}
        >

		  <MenuItem value='Korean'>한글</MenuItem>
		  <MenuItem value='English'>영어</MenuItem>
          <MenuItem value='Japanese'>일본어</MenuItem>
          <MenuItem value='Chinese'>중국어</MenuItem>

        </Select>
				</div>
			</div>
			<div className={classes.content}>
				<TextField
					value={title}
					onChange={e => setTitle(e.target.value)}
					id="uploadDirect1"
					label="제목"
					multiline
					rows="1"
					variant="outlined"
				/>
				<TextField
					value={content}
					onChange={f => setContent(f.target.value)}
					id="uploadDirect2"
					label="내용"
					multiline
					rows="20"
					variant="outlined"
					className={classes.content2}
				/>
					<input
						accept="image/*"
						className={classes.input}
						id="contained-button-file"
						multiple
						type="submit"
						style={{display:"none"}}
					/>
					<label htmlFor="contained-button-file">
						<Button variant="contained" color="primary" component="span" >
							업로드
						</Button>
					</label>
			</div>
		</form>
	)
}
 
export default UploadDirect;