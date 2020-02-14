import React, {FC, useCallback, useState} from "react";
import {Button, Col, Divider, InputNumber, message, Row, Typography} from 'antd';
import axios from 'axios';

const {Title, Text} = Typography;

type GAResponse = {
    bestFitness: number,
    worstFitness: number,
    genes: number[][],
};

export const GA: FC = () => {
    const [sizePopulation, setSizePopulation] = useState<number>(10);
    const [numGeneration, setNumGeneration] = useState<number>(100);
    const [gaRes, setGARes] = useState<GAResponse>();
    const onClick = useCallback(async () => {
        try {
            const res = await axios.get('/best-champions', {
                params: {
                    SizePopulation: sizePopulation,
                    NumGeneration: numGeneration,
                }
            });
            const ga :GAResponse = res.data;
            console.log(ga);
            setGARes(ga);
        } catch (e) {
            message.error(e);
        }
    }, [sizePopulation, numGeneration]);
    return (
        <div style={{margin: 20, backgroundColor: '#fff', padding: 20}}>
            <Title>GA</Title>
            <Divider/>
            <Text>유전 알고리즘 기반 챔피언 조합 추천</Text>
            <Row>
                <Col>
                    <label>초기 유전자 수</label>
                    <InputNumber min={10} max={100000} onChange={(e) => setSizePopulation(e ? e : 10)}/>
                </Col>
                <Col>
                    <label>세대 수</label>
                    <InputNumber min={100} max={1000000} onChange={(e) => setNumGeneration(e ? e : 100)}/>
                </Col>
                <Col>
                    <Button onClick={onClick}>탐색</Button>
                </Col>
            </Row>
            <Row>
                <Text>최고 점수 : {gaRes?.bestFitness}</Text>
                <Text>최저 점수 : {gaRes?.worstFitness}</Text>
                <br/>
                {
                    gaRes?.genes.map((r) => (
                        <>
                            {
                                r.map((i) => (
                                    <img src={`/champions/${i}.png`}/>
                                ))
                            }
                            <br/>
                        </>
                    ))
                }
            </Row>
        </div>
    )
};
