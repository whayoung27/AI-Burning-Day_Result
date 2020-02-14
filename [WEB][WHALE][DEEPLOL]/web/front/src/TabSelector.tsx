import React, {FC, useCallback, useMemo, useState} from 'react';
import styled from "styled-components";
import {Col, Divider, Row, Typography} from "antd";

const {Text} = Typography;

export type TabSelectorProps = {};

const Black = styled.img`
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=);
  width: 23px;
  height: 23px;
`;
// 242 71
// TabSelector.tsx:16 240 124

const ITEMS = [1001, 1004, 1006, 1011, 1018, 1026, 1027, 1028, 1029, 1031, 1033, 1036, 1037, 1038, 1039, 1041, 1042, 1043, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1082, 1083, 1400, 1401, 1402, 1412, 1413, 1414, 1416, 1419, 2015, 2051, 2055, 2065, 2138, 2139, 2140, 2403, 2419, 2420, 2421, 2422, 2423, 2424, 3001, 3003, 3004, 3006, 3007, 3008, 3009, 3010, 3020, 3022, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3033, 3035, 3036, 3040, 3041, 3042, 3043, 3044, 3046, 3047, 3048, 3050, 3052, 3053, 3057, 3065, 3067, 3068, 3070, 3071, 3072, 3073, 3074, 3075, 3076, 3077, 3078, 3082, 3083, 3084, 3085, 3086, 3087, 3089, 3091, 3094, 3095, 3100, 3101, 3102, 3105, 3107, 3108, 3109, 3110, 3111, 3112, 3113, 3114, 3115, 3116, 3117, 3123, 3124, 3133, 3134, 3135, 3136, 3137, 3139, 3140, 3142, 3143, 3144, 3145, 3146, 3147, 3151, 3152, 3153, 3155, 3156, 3157, 3158, 3161, 3165, 3174, 3175, 3179, 3181, 3184, 3190, 3191, 3193, 3194, 3196, 3197, 3198, 3200, 3211, 3222, 3285, 3348, 3371, 3373, 3374, 3379, 3380, 3382, 3383, 3384, 3386, 3387, 3388, 3389, 3390, 3400, 3410, 3416, 3422, 3455, 3504, 3508, 3513, 3514, 3520, 3599, 3600, 3671, 3672, 3673, 3675, 3680, 3681, 3682, 3683, 3684, 3685, 3690, 3691, 3692, 3693, 3694, 3695, 3706, 3715, 3742, 3748, 3751, 3800, 3801, 3802, 3812, 3814, 3850, 3851, 3853, 3854, 3855, 3857, 3858, 3859, 3860, 3862, 3863, 3864, 3901, 3902, 3903, 3905, 3907, 3916]
const CHAMPIONS = [266, 103, 84, 12, 32, 34, 1, 523, 22, 136, 268, 432, 53, 63, 201, 51, 164, 69, 31, 42, 122, 131, 119, 36, 245, 60, 28, 81, 9, 114, 105, 3, 41, 86, 150, 79, 104, 120, 74, 420, 39, 427, 40, 59, 24, 126, 202, 222, 145, 429, 43, 30, 38, 55, 10, 141, 85, 121, 203, 240, 96, 7, 64, 89, 127, 236, 117, 99, 54, 90, 57, 11, 21, 62, 82, 25, 267, 75, 111, 518, 76, 56, 20, 2, 61, 516, 80, 78, 555, 246, 133, 497, 33, 421, 58, 107, 92, 68, 13, 113, 235, 875, 35, 98, 102, 27, 14, 15, 72, 37, 16, 50, 517, 134, 223, 163, 91, 44, 17, 412, 18, 48, 23, 4, 29, 77, 6, 110, 67, 45, 161, 254, 112, 8, 106, 19, 498, 101, 5, 157, 83, 350, 154, 238, 115, 26, 142, 143,];

export const TabSelector: FC<TabSelectorProps> = (props) => {
    const [items, setItems] = useState<number[]>([0, 0, 0, 0, 0, 0,]);
    const [champ, setChamp] = useState<number>(0);
    const removeItem = useCallback((i) => {
        const j = items.indexOf(i);
        if (j === -1) return;
        items[j] = 0;
        setItems([...items]);
    }, [items, setItems]);
    const addItem = useCallback((i) => {
        const j = items.indexOf(0);
        if (j === -1) return;
        items[j] = i;
        setItems([...items]);
    }, [items, setItems]);
    const itemViews = useMemo(() => (

        items.map((i) => (
            i === 0 ? <Black style={{width: 35, height: 35}}/>
                : <img src={`/items/${i}.png`} style={{width: 35, height: 35}} onClick={() => removeItem(i)}/>
        ))
    ), [items]);
    const champView = useMemo(() => (
        champ === 0 ? <Black style={{width: 60, height: 60}}/>
            : <img src={`/champions/${champ}.png`}/>
    ), [champ]);
    return <>
        <Text>챔피언</Text>
        <Row>
            <div>
                {champView}
            </div>
        </Row>
        <Row>
            <div style={{maxWidth: '800px'}}>
                {
                    CHAMPIONS.map((i) => (
                        <img src={`/champions/${i}.png`}
                             style={{width: 30, height: 30}}
                        onClick={() => setChamp(i)}/>
                    ))
                }
            </div>
        </Row>
        <Divider/>
        <Text>아이템</Text>
        <Row>
            <div>
                {itemViews}
            </div>
        </Row>
        <br/>
        <Row>
            <Col>
                <div style={{maxWidth: '800px'}}>
                    {
                        ITEMS.map((i) => (
                            <img src={`/items/${i}.png`}
                                 onClick={() => addItem(i)}/>
                        ))
                    }
                </div>
            </Col>
        </Row>
    </>;
};