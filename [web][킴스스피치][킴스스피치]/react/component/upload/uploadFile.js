import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

function generate(element) {
    return [0, 1, 2].map(value =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

const useStyles = makeStyles(theme =>({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 500,
            '& > *': {
                margin: theme.spacing(1),
              }
        },

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
		width: '20%',
		fontSize: '1rem',
    fontWeight: 'bold',
		margin: '2rem 20% 0 5%',
		height: '2rem'
    },
    input: {
        display: 'none',
      }
} ));

const UploadFile = () =>{

    const classes = useStyles();
    const [secondary, setSecondary] = React.useState(false);

    const [dense, setDense] = React.useState(false);

    return (
      
        
        <form className={classes.root} noValidate autoComplete="off">
            <div className={classes.root}>
            <div className={classes.title}>파일 업로드</div>

          <div className={classes.content}>


          <Grid container spacing={2}>
       
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            업로드 할 스크립트 목록
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="스크립트"
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>,
              )}
            </List>
          </div>
        </Grid>
      </Grid>


          <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          업로드
        </Button>
        </label>
        </div>
		  </div>
	</form>
	
	  )

}


export default UploadFile;