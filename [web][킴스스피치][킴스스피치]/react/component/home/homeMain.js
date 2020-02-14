import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import logoImg from '../../image/logo.jpg';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import homeImg1 from '../../image/home1.png';
import homeImg2 from '../../image/home2.png';
import homeImg3 from '../../image/home3.png';
import homeImg4 from '../../image/home4.png';
import homeImg5 from '../../image/home5.png';
const useStyles = makeStyles({
  root: {

  },
  title: {
    width: '100%',
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '1rem 0 0 0'
  },
  logo:{
    height: '10rem',
    width: '10rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
  },
  img: {
    height: '25rem',
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
});
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const tutorialSteps = [
  {
    imgPath: homeImg1,
  },
  {
    imgPath: homeImg2,
  },
  {
    imgPath: homeImg3,
  },
  {
    imgPath: homeImg4,
  },
  {
    imgPath: homeImg5,
  },

];
const HomeMain = () => {
  useEffect(() => {

  },[])
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const handleStepChange = step => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>     
      <AutoPlaySwipeableViews
        style={{height:'30rem'}}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {tutorialSteps.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img className={classes.img} src={step.imgPath} alt={step.label} />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      
    </div>
  )
}
export default HomeMain;