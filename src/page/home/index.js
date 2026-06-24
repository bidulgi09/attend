import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { Helmet } from 'react-helmet-async';

import { ReactComponent as Logo } from '../../assets/logo.svg';

function HomePage() {
    return (
        <div className="HomePage">
            <Helmet>
                <title>출첵커 | 홈</title>
            </Helmet>
            <main className='main'>
                 [박스1]
            </main>
            <main className='main'>
                 [박스2]
            </main>
            <main className='main'>
                 [박스3]
            </main>
        </div>
    )
}

export default HomePage;