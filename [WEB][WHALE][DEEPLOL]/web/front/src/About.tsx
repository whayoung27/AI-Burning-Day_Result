import React, {FC} from "react";
import {Divider, Typography} from 'antd';

const {Title} = Typography;

export const About : FC = () => {
    return (
        <div style={{margin: 20, backgroundColor: '#fff', padding: 20}}>
            <Title>About</Title>
            <Divider/>
            <p>
                이은찬, 조휘연, 한석현
            </p>
        </div>
    )
};