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
            <main className='main' style={{backgroundColor: "rgba(255, 0, 0, 0.1)"}}>
                 <div className='banner'>
                    <ul className='rolling'>
                        <li className='red'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='green'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='blue'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='white'><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                    <ul className='rolling'>
                        <li className='red'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='green'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='blue'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='white'><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                 </div>
            </main>
            <main className='main' style={{backgroundColor: "rgba(0, 255, 0, 0.1)"}}>
                 <div className='banner'>
                    <ul className='rolling'>
                        <li className='red'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='green'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='blue'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='white'><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                    <ul className='rolling'>
                        <li className='red'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='green'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='blue'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='white'><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                 </div>
            </main>
            <main className='main' style={{backgroundColor: "rgba(0, 0, 255, 0.1)"}}>
                 <div className='banner'>
                    <ul className='rolling'>
                        <li className='red'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='green'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='blue'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='white'><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                    <ul className='rolling'>
                        <li className='red'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='green'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='blue'><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li className='white'><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                 </div>
            </main>
        </div>
    )
}

export default HomePage;