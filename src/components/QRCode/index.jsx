import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../../assets/logo_final_final.png';
import './styles.css';

function QRCode({ url, iscreated, removelink }) {
    const base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const encodeToBase62 = function (number) {
        console.log(number)
        if(number==0) return base62[0];
        let res = ''
        while(number>0) {
            res = base62[number % 62] + res;
            number = Math.floor(number / 62);
        }
        return res;
    }
    return (
        <div className='QRCode' iscreated={iscreated.toString()} >
            <div className='url'>코드:&nbsp;{url.length > 0 && encodeToBase62(parseInt(new URL(url).searchParams.get('t')))}</div>
            <div className='qr-code'>
                <div className='delete-btn' onClick={removelink}>삭제</div>
                <QRCodeSVG
                    value={url}
                    size={250}
                    level='H'
                    imageSettings={{
                        src: logo,
                        x: undefined,
                        y: undefined,
                        height: 70,
                        width: 70,
                        excavate: false
                    }}
                />
            </div>
        </div>
    );
}

export default QRCode;