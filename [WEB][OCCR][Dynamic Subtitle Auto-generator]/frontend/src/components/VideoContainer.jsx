import React, {useRef, useReducer} from 'react'

import { Row, Col } from 'antd';
import { Button, Radio, Icon } from 'antd';

import produce from "immer";
import api from "../api";
import CaptionView from './CaptionView'

const intialState = {ref: null, cues:[]}

function reducer(state, action) {
    switch (action.type) {
      case 'INSERT_REF':
          return produce(state, draft => {
              draft.ref = action.ref
          })
      case 'INSERT_CUE':
        return produce(state, draft => {
          draft.cues.push(action.payload)
        })
      case 'CLEAR':
        return intialState;
      case 'DELETE_CUE':
        return produce(state, draft => {
            draft.cues.splice(draft.cues.findIndex(cue => cue.id === action.id),1)
        })
      case 'UPDATE_TEXT':
        console.log(1+1)
        return produce(state, draft => {
            draft.cues[draft.cues.findIndex(cue => cue.id === action.id)].text = action.text;
        })
      case 'UPDATE_POS':
          return produce(state, draft => {
            draft.cues[draft.cues.findIndex(cue => cue.id === action.id)][action.xy] = action.pos;
        })
      default:
        throw new Error();
    }
}

function VideoContainer() {

    const [state, dispatch] = useReducer(reducer, intialState);
    const videoRef = useRef(null);

    const handlePlaying = (e) => {
        var cueLen = videoRef.current.textTracks[0].activeCues.length;
        dispatch({ type: 'CLEAR'})
        for (let index = 0; index < cueLen; index++) {
            var cueEl = videoRef.current.textTracks[0].activeCues[index];
            if (cueEl.size !== 0) {
                dispatch({ type: 'INSERT_CUE',
                payload: {
                    id: cueEl.id,
                    x: cueEl.position,
                    y: cueEl.line,
                    text: cueEl.text}})
            }
        }
    }

    const onVClick = async (e) => {
        const cue_id = e.target.id
        const result = await api.editVtt({
            cue_id: cue_id,
            action: 'DELETE',
            params: '', 
            edit_val: ''
        })
        videoRef.current.textTracks[0].cues.getCueById(cue_id).size = 0;
        dispatch({type:'DELETE_CUE', id:cue_id})
        console.log(result);
    }

    const onEdit = (e) => {
        const cid = e.target.id;
        const text = e.target.value;
        videoRef.current.textTracks[0].cues.getCueById(cid).text = text;
        dispatch({type:'UPDATE_TEXT', id:cid, text: text})
    
    }

    const onPosChange = async (e) => {
        const cid = e.target.id;
        const pos = parseInt(e.target.value);
        const xy = e.target.name;
        const result = await api.editVtt({
            cue_id: cid,
            action: 'EDIT',
            params: xy, 
            edit_val: pos,
        })
        const posLine = xy === 'x'? 'position' : 'line';
        videoRef.current.textTracks[0].cues.getCueById(cid)[posLine] = pos ? pos : 0;
        dispatch({type:'UPDATE_POS', id:cid, xy: xy, pos: pos})
        
        console.log(result);
    }




    return (
        <div>
            <Row>
                <Col lg={12} md={24}>
                    <video 
                        crossOrigin={"anonymous"} 
                        ref={videoRef} 
                        className="video-container video-container-overlay"
                        controls width={"100%"} height=""
                        onTimeUpdate={handlePlaying}
                    >
                        <source type="video/mp4" src={'http://127.0.0.1:5000/static/workman2.mp4'} />
                        <track
                            kind="subtitles"
                            src="http://0.0.0.0:5000/vtt/final?name=gen_06_edit.vtt"
                            srcLang="en"
                            label="VTT_POS_3"
                            default
                        />
                        <track
                            kind="subtitles"
                            src="http://0.0.0.0:5000/vtt/final?name=translate.vtt"
                            srcLang="en"
                            label="VTT_TRANSLATE"
                            default
                        />
                    </video>
                    <a href="http://0.0.0.0:5000/vtt/download?name=gen_06_edit.vtt" download="완성.vtt">
                    <Button type="primary" icon="download" size={'large'}>
                        Download
                    </Button>
                    </a>
                    <a href="http://0.0.0.0:5000/vtt/translate?name=gen_06_edit.vtt" download="translate.vtt">
                    <Button type="danger" icon="font-colors" size={'large'}>
                        Download
                    </Button>
                    </a>
                </Col>
                <Col lg={12} md={24}>
                    {state.cues.map((cue) => (
                        <CaptionView 
                            key={cue.id}
                            onBlur={onEdit}
                            onClick={onVClick}
                            onEdit={onEdit}
                            onPosChange={onPosChange}
                            cue={cue} />
                    ))}
                </Col>
            </Row>
            <Row style={{}}>
               
            </Row>
            
        </div>
    )
}

export default VideoContainer
