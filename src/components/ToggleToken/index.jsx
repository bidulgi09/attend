import React from 'react';
import './styles.css';

const ToggleToken = ({name, value, checked, onChange}) => {
    return (
        <>
            <input
                className='toggleToken'
                type='radio'
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                content={value}
                id={value}
            />
            <label htmlFor={value}>{value}</label>
        </>
    )
};

export default ToggleToken;