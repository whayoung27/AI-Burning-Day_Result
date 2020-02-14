import React , {useEffect, useState}	from 'react';
import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
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
    margin: '1rem 0 0 0.5rem',
  },
});
const createData = (idx, sentence) => {
	return { idx, sentence };
}
const sentences = [
	createData(0, 'Forty-four Americans have now taken the presidential oath.'),
  createData(1, 'The words have been spoken during rising tides of prosperity and the still waters of peace.'),
  createData(1, 'I stand here today humbled by the task before us, grateful for the trust you have bestowed, mindful of the sacrifices borne by our ancestors.'),
  createData(1, 'Yet, every so often the oath is taken amidst gathering clouds and raging storms.'),
];
var options = {
  chart: {
    type: 'spline'
  },
  title: {
    text: null
  },
  plotOptions: {
    spline: {
       marker: {
        radius: 4,
        lineColor: '#2980b9',
        lineWidth: 1
      }
    }
  },
  xAxis: {
 
  title: {
      text: '횟수'
  },
  
  min: 1,
  max: 3,
  tickInterval: 1
  
  
},
  yAxis: {
    title: {
      text: '점수'
    },
    min: 0,
    max: 100,
    tickInterval: 20
  },
  legend: {
    enabled: false
  },
  series: [
    {
      title: '점수',
      // data: [
      //   [Date.UTC(2020, 2, 1), 45],
      //   [Date.UTC(2020, 2, 3), 50],
      //   [Date.UTC(2020, 2, 5), 80],
      //   [Date.UTC(2020, 2, 10), 95],
      //   [Date.UTC(2020, 2, 12), 90]],
      data: [
        [, ],
        [, ],
        [, ],
        [, ],
      ],
      lineWidth: 3
    }
  ],
  colors: ['#3498db']
};
const ScriptAnalysis = () => {
  const [score, setScore] = useState([]);
	const [scriptID, setScriptID] = useState(0);
  const [date, setDate] = useState([]);
  const [sentenceList, setSentenceList] = useState([]);
  const [is, setIs] = useState(false);
	
  useEffect(() => {
    // var id=0;
    // var score ='';
    // var date = '';

    // setScore(score);
    // setScriptID(id);
    // setDate(date);
    const params = new URLSearchParams(location.hash.split('?')[1]);
		var id=0;
		var title ='';
		for (let p of params) {
			if (p[0]==='id'){
				id = Number(p[1]);
			}else if (p[0]==='title'){
				title = p[1]; 
			}
		}
		axios
				.get("http://localhost:5050/script/analysis/"+id)
      .then(res => {

        //console.log(res.data[0])  
        console.log(res)  
    var total = []
    for(var i=0; i<res.data[0].length ; i++) {
     
     // var TheDate = new Date();
      
    //  console.log( TheDate.toUTCString() );
    
    const dateform = res.data[0][i]['DATE']
      var temp = [dateform, res.data[0][i]['SCORE']]
      total.push(temp);

    }
      
    
     console.log(total)


options.series[0].data = total

 console.log(options.series[0].data);

 console.log(res.data[1]);
 setSentenceList(res.data[1]);
 
 setIs(true);

      })
      .catch(err => {
        console.log(err);
      });
   
  },[])

  const classes = useStyles();
  return (
    <div className={classes.root}>
      {is?(
        <div>
          <div className={classes.title}>
        <Button className={classes.titleIcon} component={Link} to="/script"><ArrowBackIcon /></Button>
        <div className={classes.titleText}>분석</div>
      </div>
      <div className={classes.contentTitle}>발표 점수 추이</div>
      <div className={classes.content}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className={classes.contentTitle}>자주 틀린 문장</div>
      <ul>
        {sentenceList.map(sentence=>(
          <li className={classes.content} key={sentence.SENTENCE}>
            {sentence.SENTENCE}
          </li>
        ))}
      </ul>
        </div>
      ):(
        <div style={{textAlign:'center'}}>
          <div>
           <CircularProgress/>
          </div>
        </div>
      )}
      
    </div>
  )
}
export default ScriptAnalysis;