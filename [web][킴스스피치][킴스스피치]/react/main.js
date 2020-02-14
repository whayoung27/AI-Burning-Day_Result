import React from 'react';
import {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Link, Route, Switch } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import BackupIcon from '@material-ui/icons/Backup';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import home from './component/home/homeMain';
import my from './component/my/myMain';
import script from './component/script/scriptMain';
import ScriptPractice from './component/script/scriptPractice';
import ScriptPresentation from './component/script/scriptPresentation';
import ScriptAnalysis from './component/script/scriptAnalysis';
import upload from './component/upload/uploadMain';
import uploadDirect from './component/upload/uploadDirect';
import uploadFile from './component/upload/uploadFile';
import axios from 'axios';

const theme = createMuiTheme({ 
	palette: {
		primary: {
			main: '#0984e3',

		},
		secondary: {
			main: '#74b9ff'
		},
	},
})
const useStyles = makeStyles({
	root: {
		background: '#ecf0f1',
		width: '100%',
		height: '100%'
	},
	main: {
		padding:'1rem',
		background: '#ffffff',
		overflowY:'scroll',
		width: '50%',
		height: '90%',
		margin: '0 25% 0 25%',
		boxSizing: 'border-box',
		'@media (max-width:960px)': {
			width: '100%',
			margin: '0'
		}
	},
	tabs: {
		position: 'fixed',
		borderTop:'1px solid #ddd',
		background: '#ffffff',
		left: '0',
		bottom: '0',
		height: '10%',
		width: '50%',
		margin: '0 25% 0 25%',
		'@media (max-width:960px)': {
			width: '100%',
			margin: '0'
		}
	},
	tab: {
		fontSize: '1rem',
		fontWeight:'bold',
	}
});


const Main = () => {



	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};


	const [data, setData] = useState([]);

	

	return (
			
		<ThemeProvider theme={theme}>
			<Router>
				<div className={classes.root}>
					<div className={classes.main}>
						<Switch>
							<Route exact path="/" component={home} />
							<Route exact path="/main" component={home} />
							<Route exact path="/home" component={home} />
							<Route exact path="/my" component={my} />
							<Route exact path="/script" component={script} />
							<Route exact path="/scriptPractice" component={ScriptPractice} />
							<Route exact path="/scriptPresentation" component={ScriptPresentation} />
							<Route exact path="/scriptAnalysis" component={ScriptAnalysis}/>
							<Route exact path="/upload" component={upload} />
							<Route exact path="/uploadDirect" component={uploadDirect} />
							<Route exact path="/uploadFile" component={uploadFile} />
						</Switch>
						<Tabs
							value={value}
							className={classes.tabs}
							onChange={handleChange}
							variant="fullWidth"
							indicatorColor="primary"
							textColor="primary"
						>
							<Tab className={classes.tab} icon={<HomeIcon />} label="홈" component={Link} to="/home" />
							<Tab className={classes.tab} icon={<DescriptionIcon />} label="스크립트" component={Link} to="/script" />
							<Tab className={classes.tab} icon={<BackupIcon />} label="업로드" component={Link} to="/upload" />
							<Tab className={classes.tab} icon={<AccountCircleIcon />} label="내정보" component={Link} to="/my" />
						</Tabs>
					</div>
				</div>
			</Router>
		</ThemeProvider>

	)
}
export default Main;