import React from 'react';
import './styles.css';
import { Helmet } from 'react-helmet-async';

import banner from '../../assets/배너.png';
function HomePage() {
    return (
        <div className="HomePage">
            <Helmet>
                <title>출첵커 | 홈</title>
            </Helmet>
            <div className='background'>
                <div className='banner'>
                    <ul className='rolling'>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                    <ul className='rolling'>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                </div>
                <div className='banner'>
                    <ul className='rolling'>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                    <ul className='rolling'>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HomePage;