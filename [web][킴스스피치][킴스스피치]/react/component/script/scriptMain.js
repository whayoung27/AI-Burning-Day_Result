import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ScriptMainMenu from './scriptMainMenu';
import axios from "axios";
const useStyles = makeStyles({
  root: {
  },
  title: {
    width: '100%',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  content:{
    margin: '1rem 0 0 0'
  }
});
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  body: {
    fontSize: '1rem',
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);
const ScriptMain = () => {
  useEffect(() => {
    axios
      //.get("https://kims-speech.herokuapp.com/script/get-list")
      .get("http://localhost:5050/script/get-list")
      .then(res => {
        console.log(res.data);
        setScriptList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  },[])
  const [scriptList, setScriptList] = useState([]);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        전체 스크립트 목록
      </div>
      <TableContainer component={Paper} className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{width:'70%'}}>제목</StyledTableCell>
              <StyledTableCell  style={{width:'20%'}}align="right">언어</StyledTableCell>
              <StyledTableCell  style={{width:'5%'}}align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scriptList.map(row => (
              <StyledTableRow key={row.SCRIPT_ID}>
                <StyledTableCell component="th" scope="row">
                  {row.SCRIPT_NAME}
                </StyledTableCell>
                <StyledTableCell align="right">{row.LANGUAGE}</StyledTableCell>
                <StyledTableCell align="right">
                  <ScriptMainMenu lan={row.LANGUAGE} scriptID={row.SCRIPT_ID} scriptTitle={row.SCRIPT_NAME}/>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default ScriptMain;