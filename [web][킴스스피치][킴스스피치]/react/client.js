const ReactDom = require('react-dom');
const React = require('react');
const {hot} = require('react-hot-loader/root');
import Main from './Main';
import './client.css';
const Hot = hot(Main);
ReactDom.render(<Hot/>, document.querySelector('#root')); 