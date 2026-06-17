import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

import { ReactComponent as Logo } from '../../assets/logo.svg';

function HomePage() {
    return (
        <div className="HomePage">
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