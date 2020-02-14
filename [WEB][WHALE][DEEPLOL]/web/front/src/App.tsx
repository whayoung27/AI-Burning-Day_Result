import React from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {Layout, Menu} from "antd";
import {Main} from "./Main";
import styled from 'styled-components';
import {About} from "./About";
import {GA} from "./GA";

const {Header, Footer, Content} = Layout;

const Logo = styled.div`
    display: inline-block;
    float: left;
    color: white;
`;

const App = () => {
    return (
        <Router>
            <Layout>
                <Header>
                    <Logo>Deep LoL</Logo>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{lineHeight: '64px'}}>
                        <Menu.Item key="1">
                            <Link to="/">
                                홈
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/ga">
                                유전알고리즘 챔피언 조합 추천
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/about">
                                만든이
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <Switch>
                        <Route path="/ga">
                            <GA/>
                        </Route>
                        <Route path="/about">
                            <About/>
                        </Route>
                        <Route path="/">
                            <Main/>
                        </Route>
                    </Switch>
                </Content>
                <Footer></Footer>
            </Layout>
        </Router>
    );
};

export default App;
