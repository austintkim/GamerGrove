import { useState, useEffect } from 'react';
import Landing from './components/Home/Landing';
import Nav from './Nav';
import Row from './components/Home/Rows'
import Menu from './components/Home/Menu';

function Home () {
    return(
        <div>
            <Nav />
            <Menu />
            <Landing />
            <Row title="Games" />


        </div>
    )
}

export default Home
