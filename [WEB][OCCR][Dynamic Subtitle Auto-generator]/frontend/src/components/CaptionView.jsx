import React, {useState} from 'react'
import { Button, Icon } from 'antd';

import api from "../api";

const ButtonGroup = Button.Group;

const captionStyle = {
    height: '50px',
    padding: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: '500',
    backgroundColor: 'white',
    borderRadius: '5px',
}


const moduleBorderWrap = {
    position: "relative",
    background: "linear-gradient(to right, green, blue)",
    padding: "3px",
    margin: "20px 5px",
    borderRadius: '5px',
  }

const inputStyle = {
    width: '300px'
}

const inputNumStyle = {
    width: '100px'
}

function CaptionView({onClick, onEdit, onPosChange, cue }) {
    const [etoggle, setEtoogle] = useState(true);

    const onEditClick = async (e) => {
        if (!etoggle) {
            const result = await api.editVtt({
                cue_id: cue.id,
                action: 'EDIT',
                params: 'text', 
                edit_val: cue.text,
            })
            console.log(result);
        }
        setEtoogle((prev)=>!prev);
        
    }

    return (
        <div style={moduleBorderWrap}>
        <div style={captionStyle}>
            <div style={inputStyle}>
            { etoggle?
                <span onClick={onEditClick} >{cue.text}</span>
                :<input style={{width: '300px'}} id={cue.id} onChange={onEdit} value={cue.text}/>
            }</div>
            {/* <Paragraph>{cue.text}</Paragraph> */}
            <ButtonGroup>
            { etoggle?
                <Button type="dashed" onClick={onEditClick} size="small" icon="edit" />
                :<Button type="primary" onClick={onEditClick} size="small" icon="check" />
            }
                <Button id={cue.id} onClick={onClick} type="danger" size="small" icon="delete" />
            </ButtonGroup>
            | <Icon type="column-width"  />
            <input type="number" onChange={onPosChange} id={cue.id} name='x' style={inputNumStyle} value={cue.x} />
            | <Icon type="column-height" />
            <input type="number" onChange={onPosChange} id={cue.id} name='y' style={inputNumStyle} value={cue.y} />
        </div>
        </div>
    )
}

export default CaptionView
