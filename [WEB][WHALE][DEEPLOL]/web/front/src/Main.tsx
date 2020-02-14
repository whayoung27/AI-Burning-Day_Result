import React, {FC, useCallback, useMemo, useState} from "react";
import {Divider, Typography} from 'antd';
import {Gluejar} from "@charliewilco/gluejar";
import {TabSelector} from "./TabSelector";

const {Title} = Typography;

export const Main: FC = () => {
    return (
        <div style={{margin: 20, backgroundColor: '#fff', padding: 20}}>
            <Title>Deep LoL</Title>
            <Divider/>
            <TabSelector/>
        </div>
    )
};