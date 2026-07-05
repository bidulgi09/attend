import React, { useState, useEffect } from 'react'
import Logo from '../../assets/logo.svg?react';
import EyePasswordShow from '../../assets/eye-password-show.svg?react';
import EyePasswordHide from '../../assets/eye-password-hide.svg?react';
import './styles.css';

import UserInput from '../../components/UserInput/index.jsx';
import UserButton from '../../components/UserButton/index.jsx';
import ToggleToken from '../../components/ToggleToken/index.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import UserManager from '../../server/utils/UserManager.js';

function SignupPage({ user, setUser }) {
    const navigate = useNavigate();
    async function redirect(user) {
        setIsLoading(true);
        let data = await UserManager.profile();
        if(data.success && user.isLogin) {
            setIsLoading(false);
            return navigate('/home', { replace: true });
        }
        return setIsLoading(false);
    }
    async function signup(user, agree, event) {
        if(!agree) {
            return alert("이용 약관에 동의해주세요.");
        }
        let check = await UserManager.check(user.email, user.name);
        if(!check.results.isAvailable) return alert("이미 존재하는 계정입니다.");
        let data = await UserManager.signUp(user.name, user.email, user.password, user.role);
        if(data.success) {
            let login = await UserManager.logIn(user.name, user.password, user.role);
            if(login.success) {
                let profile = await UserManager.profile();
                console.log(JSON.stringify(profile, null, 4))
                setUser({...profile.results.user, isLogin: true});
                setInfo({ name: '', password: '', email: '', role: '' });
                alert("가입 성공");
            } else {
                setUser({...user, isLogin: false});
                alert("가입  실패\n" + JSON.stringify(data));
            }
        } else {
            setUser({...user, isLogin: false});
            alert("가입  실패\n" + JSON.stringify(data));
        }
        return;
    }
    useEffect(() => {
        redirect(user);
    }, [user.isLogin]);

    useEffect(() => {
        redirect(user);
    }, []);
    
    const setUserEmail = (event) => {
        return setInfo({...info, email : event.target.value });
    };
    const setUserName = (event) => {
        if(/[^\d]/.test(event.target.value)) {
            event.target.value = event.target.value.replace(/[^\d]/g, '');
        }
        let val = event.target.value.replace(/[^\d]/g, '');
        if(val.length > 2) {
            event.target.value = val.substring(0, 2) + '-' + val.substring(2, 7);
        }
        return setInfo({...info, name: event.target.value});
    };
    const setUserRole = (event) => {
        return setInfo({...info, role: event.target.value == "학생" ? "Student" : "Teacher"});
    };
    const setUserPW = (event) => {
        return setInfo({...info, password: event.target.value});
    };
    
    const [info, setInfo] = useState({
        name: '',
        password: '',
        email: '',
        role: 'Student'
    });
    const [isAgree, setIsAgree] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const [lockedVisible, setLockedVisible] = useState(false);
    const [hoverVisible, setHoverVisible] = useState(false);

    const isVisible = hoverVisible || lockedVisible;

    return (
        <div className="SignupPage">
            <Helmet>
                <title>출첵커 | 회원가입</title>
            </Helmet>
            <div className='signup'>
                <Link to="/">
                    <Logo fill="red" />
                </Link>
                <form>
                    <div className='credentials-row toggle'>
                        <ToggleToken
                            name='user-type'
                            value='학생'
                            checked={info.role === 'Student'}
                            onChange={setUserRole}
                        />
                        <ToggleToken
                            name='user-type'
                            value='교사'
                            checked={info.role === 'Teacher'}
                            onChange={setUserRole}
                        />
                        <div className='indicator'></div>
                    </div>
                    <div className='credentials-row'>
                        <div className='inputs'>
                            <UserInput
                                name='user-name'
                                type='text'
                                placeholder='유저 아이디 (00-00000)'
                                pattern="\d{2}-\d{5}"
                                value={info.name || ""}
                                onChange={ setUserName }
                            />
                            <UserInput 
                                name='user-email' 
                                type='email' 
                                placeholder='이메일 주소' 
                                value={info.email || ""} 
                                onChange={ setUserEmail } 
                            /> 
                            <div className='inputs pw-visible'>
                                <UserInput
                                    name='user-password'
                                    type={ isVisible ? 'text' : 'password' }
                                    placeholder='비밀번호'
                                    value={info.password || ""}
                                    onChange={ setUserPW }
                                />
                                <div className='visible-toggle' 
                                    onClick={() => { setLockedVisible(!lockedVisible) }} 
                                    onMouseOver={() => { setHoverVisible(true) }} 
                                    onMouseOut={() => { setHoverVisible(false) }}
                                >
                                    <span id='pw-visible-btn'> { isVisible ? <EyePasswordShow width="30px" height="14px"/> : <EyePasswordHide width="30px" height="14px"/> }</span>
                                </div>
                            </div>
                        </div>
                        <UserButton
                            text='회원가입'
                            disabled={isLoading}
                            onClick={async() => { await signup(info, isAgree); }} 
                        />
                    </div>
                    <div className="terms-box">
                        <label className='agree-box'>
                            <span className='agree-text'>다음 이용약관에 동의하십니까?</span>
                            <span className='check-box'>
                                <input type="checkbox" onClick={() => setIsAgree(!isAgree)}/>
                                예
                            </span>
                        </label>
                        <div className="terms">
                            <strong>
                                이용약관
                            </strong>
                            <br/>
                            <p>
                                본 이용약관은 bidulgi09가 운영하는 출첵커 웹 브라우저용 애플리케이션 및 관련 서비스(이하 "애플리케이션")에 적용됩니다. 본 약관에서 bidulgi09는 "서비스 제공자"를 의미합니다.
                            </p>
                            <br/>
                            <p>
                                애플리케이션을 다운로드하거나 사용하는 경우 귀하는 본 이용약관에 동의한 것으로 간주됩니다. 애플리케이션을 사용하기 전에 반드시 본 약관을 주의 깊게 읽어주시기 바랍니다.
                            </p>
                            <br/>
                            <div>
                                <strong>
                                    애플리케이션 사용 라이선스
                                </strong>
                                <p>
                                    귀하가 본 약관을 준수하는 것을 조건으로, 서비스 제공자는 귀하에게 개인적 또는 내부 업무 목적을 위해 귀하의 기기에 애플리케이션을 설치하고 사용할 수 있는 제한적이고 비독점적이며 양도 불가능하고 취소 가능한 사용 권한을 부여합니다. 관련 법률에서 명시적으로 허용하는 경우를 제외하고 귀하는 애플리케이션을 복제, 배포, 수정하거나 파생 저작물을 제작할 수 없으며, 리버스 엔지니어링, 디컴파일 또는 디스어셈블할 수 없습니다.
                                </p>
                            </div>
                            <br/>
                            <strong>
                                지적재산권
                            </strong>
                            <p>
                                서비스 제공자는 애플리케이션의 코드, 디자인, 상표, 서비스표, 상호, 로고 및 브랜딩을 포함한 모든 지적재산권을 보유합니다. 본 약관의 어떠한 내용도 귀하에게 서비스 제공자의 상표, 로고 또는 브랜드를 사용할 수 있는 권리를 부여하지 않습니다. 귀하는 애플리케이션 내에 표시된 저작권, 상표권 또는 기타 권리 고지를 제거, 변경 또는 숨길 수 없습니다.
                            </p>
                            <br/>
                            <strong>
                                이용 종료
                            </strong>
                            <p>
                                귀하가 본 약관을 중대하게 위반하는 경우 서비스 제공자는 귀하의 애플리케이션 또는 서비스 이용을 정지할 수 있습니다. 서비스 제공자는 위반 사실을 서면으로 통지하며, 시정 가능한 위반 사항의 경우 귀하는 통지를 받은 날로부터 14일 이내에 이를 시정할 수 있습니다. 해당 기간 내에 위반 사항이 시정되지 않을 경우 서비스 제공자는 귀하의 이용 권한을 종료할 수 있습니다.
                            </p>
                            <br/>
                            <p>
                                또한 관련 법률 위반, 지적재산권 침해 또는 다른 사용자나 서비스 제공자에게 피해를 줄 수 있는 활동을 한 경우 서비스 제공자는 별도의 통지 없이 즉시 귀하의 이용 권한을 정지하거나 종료할 수 있습니다.
                            </p>
                            <br/>
                            <p>
                                이용이 종료되는 경우 귀하의 애플리케이션 사용 권한은 즉시 종료되며 귀하는 보유하고 있는 모든 사본을 삭제해야 합니다.
                            </p>
                            <br/>
                            <p>
                                귀하는 귀하의 관할 지역에서 본 애플리케이션을 합법적으로 사용할 수 있는 자격이 있음을 보증합니다. 애플리케이션 이용 가능 연령은 만 18세 이상(또는 해당 지역의 디지털 동의 가능 연령 이상)입니다. 만 18세 미만인 경우 부모 또는 법정대리인이 귀하를 대신하여 본 약관을 검토하고 동의해야 합니다.
                            </p>
                            <div>
                                <br/>
                                <p>
                                    애플리케이션, 애플리케이션의 일부 또는 서비스 제공자의 상표를 무단으로 복사하거나 수정하는 행위는 엄격히 금지됩니다. 또한 애플리케이션의 소스 코드를 추출하거나 다른 언어로 번역하거나 파생 버전을 제작하는 행위 역시 허용되지 않습니다. 애플리케이션과 관련된 모든 상표권, 저작권, 데이터베이스 권리 및 기타 지적재산권은 서비스 제공자에게 귀속됩니다.
                                </p>
                            </div>
                            <strong>
                                사용자 생성 콘텐츠 및 허용되는 이용 행위
                            </strong>
                            <p>
                                본 애플리케이션이 사용자의 콘텐츠 게시, 공유 또는 업로드 기능을 제공하는 경우, 귀하는 다음과 같은 콘텐츠를 게시하지 않을 것에 동의합니다.
                            </p>
                            <ul>
                                <li>
                                    불법적이거나 제3자의 지적재산권(저작권, 상표권, 특허권 등)을 침해하는 콘텐츠
                                </li>
                                <li>
                                    욕설, 협박, 괴롭힘, 명예훼손 또는 혐오 표현이 포함된 콘텐츠
                                </li>
                                <li>
                                    차별, 폭력 선동 또는 불법 행위를 조장하는 콘텐츠
                                </li>
                                <li>
                                    스팸, 피싱 또는 악성코드를 포함한 콘텐츠
                                </li>
                                <li>
                                    타인의 개인정보 또는 개인정보 보호 권리를 침해하는 콘텐츠
                                </li>
                                <li>
                                    허위, 오해의 소지가 있거나 기만적인 콘텐츠
                                </li>
                                <li>
                                    노골적인 폭력 또는 성적 내용을 포함한 콘텐츠(적절한 연령 제한이 적용된 경우는 제외)
                                </li>
                            </ul>
                            <br/>
                            <p>
                                서비스 제공자는 다음 권리를 보유합니다.
                            </p>
                            <ul>
                                <li>
                                    본 지침을 위반하는 콘텐츠를 삭제하거나 접근을 제한할 권리
                                </li>
                                <li>
                                    본 지침을 반복적으로 위반하는 사용자의 계정을 정지하거나 종료할 권리
                                </li>
                                <li>
                                    불법 콘텐츠가 신고된 경우 수사기관과 협조할 권리
                                </li>
                                <li>
                                    본 약관, 관련 법률 또는 상기 지침을 위반하는 콘텐츠를 검토, 필터링 또는 숨길 권리
                                </li>
                            </ul>
                            <br/>
                            <p>
                                애플리케이션을 통해 제출된 콘텐츠는 애플리케이션의 기능에 따라 다른 사용자 또는 일반 대중에게 공개될 수 있습니다.
                            </p>
                            <br/>
                            <p>
                                귀하가 특정 콘텐츠가 본 약관을 위반하거나 귀하의 권리를 침해하거나 불법적이라고 판단하는 경우, dg2620628@daegun.hs.kr로 신고할 수 있습니다. 신고 시에는 서비스 제공자가 해당 콘텐츠를 식별하고, 신고 내용을 검토하며, 필요한 경우 귀하에게 연락할 수 있도록 충분한 정보를 제공해야 합니다.
                            </p>
                            <br/>
                            <p>
                                애플리케이션이 해당 기능을 제공하는 경우, 귀하는 애플리케이션 내에서 직접 콘텐츠를 신고하거나 다른 사용자를 차단하거나 알림을 음소거할 수 있습니다. 서비스 제공자는 앱 내 신고 역시 본 약관에 명시된 기준에 따라 검토합니다.
                            </p>
                            <br/>
                            <p>
                                서비스 제공자는 신고된 콘텐츠를 검토하고, 필요한 경우 추가 정보를 요청하며, 콘텐츠를 삭제하거나 접근을 제한하고, 필요한 경우 관련 계정에 조치를 취할 수 있습니다. 콘텐츠 관리 결정에 영향을 받은 사용자는 dg2620628@daegun.hs.kr로 재검토를 요청할 수 있으며, 서비스 제공자는 합리적인 기간 내에 이의 제기에 대한 결과와 사유를 안내합니다.
                            </p>
                            <br/>
                            <p>
                                귀하는 사용자 생성 콘텐츠를 제출함으로써 서비스 제공자에게 애플리케이션 및 서비스 제공자의 사업 운영과 관련하여 해당 콘텐츠를 사용, 복제, 배포, 수정, 전시 및 실행할 수 있는 비독점적이고 전 세계적이며 사용료가 없는 라이선스를 부여합니다. 단, 이는 서비스 제공자가 귀하의 콘텐츠를 애플리케이션과 무관하게 독립적으로 판매하거나 제3자에게 재라이선스할 권리를 부여하는 것은 아닙니다.
                            </p>
                            <br/>
                            <p>
                                귀하는 귀하가 게시하는 콘텐츠에 대한 모든 권리를 소유하거나 적법하게 통제하고 있으며, 해당 콘텐츠의 이용이 본 약관이나 관련 법률을 위반하지 않음을 보증합니다.
                            </p>
                            <br/>
                            <p>
                                귀하의 콘텐츠에는 개인정보가 포함될 수 있습니다. 사용자 생성 콘텐츠와 관련된 개인정보 처리는 개인정보 처리방침에 따라 이루어집니다. 타인의 개인정보는 당사자의 동의 없이 게시하지 마시기 바랍니다.
                            </p>
                            <br/>
                            <p>
                                서비스 제공자는 애플리케이션이 가능한 한 유용하고 효율적으로 운영될 수 있도록 노력하고 있습니다. 따라서 서비스 제공자는 언제든지 애플리케이션을 변경하거나 서비스 이용 요금을 부과할 권리를 보유합니다. 다만 애플리케이션 또는 서비스에 요금이 부과되는 경우, 해당 내용은 명확하게 안내됩니다.
                            </p>
                            <br/>
                            <p>
                                애플리케이션은 서비스를 제공하기 위해 귀하가 제공한 개인정보를 저장하고 처리합니다. 귀하는 자신의 기기와 애플리케이션 접근 권한을 안전하게 관리할 책임이 있습니다. 서비스 제공자는 공식 운영체제의 보안 제한을 제거하는 탈옥(Jailbreak) 또는 루팅(Rooting)을 권장하지 않습니다. 이러한 행위는 악성코드나 바이러스에 노출될 위험을 증가시키며, 애플리케이션이 정상적으로 작동하지 않거나 전혀 작동하지 않을 수 있습니다.
                            </p>
                            <br/>
                            <div>
                                <p>
                                    서비스 제공자는 일부 사항에 대해서는 책임을 지지 않음을 알려드립니다. 애플리케이션의 일부 기능은 인터넷 연결이 필요합니다. 인터넷 연결이 없거나 데이터 사용량을 모두 소진하여 애플리케이션이 정상적으로 작동하지 않는 경우 서비스 제공자는 이에 대해 책임을 지지 않습니다.
                                </p>
                                <br/>
                                <p>
                                    애플리케이션 사용 시 귀하가 이용 중인 인터넷 서비스 제공업체의 약관 역시 적용됩니다. 따라서 애플리케이션 사용 중 발생하는 데이터 사용 요금은 귀하의 부담이며, 귀하는 이에 대한 책임을 부담합니다.
                                </p>
                            </div>
                            <p>
                                마찬가지로 서비스 제공자는 귀하의 애플리케이션 사용 방식에 대해 항상 책임을 질 수는 없습니다. 예를 들어, 귀하의 기기가 충분한 배터리를 유지하도록 관리하는 것은 귀하의 책임입니다. 기기의 배터리가 방전되어 서비스에 접근할 수 없는 경우 서비스 제공자는 이에 대해 책임을 지지 않습니다.
                            </p>
                            <br/>
                            <p>
                                본 약관의 어떠한 내용도 관련 소비자 보호법에 따라 귀하에게 부여되는 권리 중 법적으로 제한하거나 배제할 수 없는 권리를 제한하지 않습니다.
                            </p>
                            <strong>
                                책임의 제한
                            </strong>
                            <p>
                                관련 법률이 허용하는 최대 범위 내에서 서비스 제공자는 수익 손실, 데이터 손실 또는 사업 중단을 포함하되 이에 한정되지 않는 간접적, 부수적, 특별, 결과적 또는 징벌적 손해에 대해 책임을 지지 않습니다. 이는 서비스 제공자가 그러한 손해의 발생 가능성을 사전에 통지받은 경우에도 동일하게 적용됩니다.
                            </p>
                            <br/>
                            <p>
                                다만 서비스 제공자는 다음 사항에 대해서는 전적인 책임을 부담합니다.
                            </p>
                            <ul>
                                <li>
                                    과실로 인해 발생한 사망 또는 신체적 상해
                                </li>
                                <li>
                                    사기 또는 사기성 허위 진술
                                </li>
                                <li>
                                    관련 법률에 따라 책임을 제한하거나 배제할 수 없는 기타 책임
                                </li>
                            </ul>
                            <br/>
                            <p>
                                관련 법률이 허용하는 최대 범위 내에서, 서비스 제공자의 총 책임 한도는 청구 발생일 이전 12개월 동안 귀하가 애플리케이션 이용을 위해 서비스 제공자에게 지급한 금액 또는 관련 법률에서 요구하는 최소 보상 금액 중 더 큰 금액으로 제한됩니다. 애플리케이션이 무료로 제공되는 경우 서비스 제공자의 책임은 관련 법률이 허용하는 최소 범위로 제한됩니다.
                            </p>
                            <br/>
                            <p>
                                서비스 제공자는 본 애플리케이션을 통해 제공되는 제3자의 정보에 전적으로 의존하여 발생한 직간접적인 손해 또는 제3자가 제공한 정보의 부정확성으로 인해 발생한 손해에 대해 어떠한 책임도 지지 않습니다.
                            </p>
                            <br/>
                            <strong>
                                면책 및 배상
                            </strong>
                            <p>
                                관련 법률이 허용하는 최대 범위 내에서, 귀하는 본 약관 위반 또는 귀하의 고의적인 애플리케이션 오용으로 인해 발생하는 모든 청구, 책임, 손해, 손실 및 비용(합리적인 변호사 비용 포함)에 대해 서비스 제공자 및 그 계열사, 임원, 직원 및 대리인을 면책하고 보호하는 데 동의합니다. 여기에는 본 약관을 위반하여 제출된 사용자 생성 콘텐츠로 인해 발생한 경우도 포함됩니다.
                            </p>
                            <br/>
                            <p>
                                단, 이러한 면책 조항은 서비스 제공자의 과실, 본 약관 위반 또는 관련 법률 위반으로 인해 발생한 청구에는 적용되지 않습니다. 소비자 면책이 법적으로 제한되는 국가 또는 지역에서는 본 조항은 법률이 허용하는 최대 범위 내에서만 적용됩니다.
                            </p>
                            <br/>
                            <p>
                                서비스 제공자는 향후 애플리케이션을 업데이트할 수 있습니다. 현재 애플리케이션은 특정 운영체제 요구사항에 따라 제공되고 있으며, 지원 운영체제가 변경될 수 있습니다. 귀하가 애플리케이션을 계속 사용하려면 필요한 업데이트를 설치해야 할 수 있습니다.
                            </p>
                            <br/>
                            <p>
                                서비스 제공자는 애플리케이션이 항상 귀하의 환경에 적합하거나 귀하의 기기에 설치된 운영체제 버전과 호환되도록 업데이트될 것을 보장하지 않습니다. 귀하는 제공되는 업데이트를 수락해야 하며, 업데이트를 설치하지 않을 경우 이전 버전에 대한 지원이 중단되거나 애플리케이션이 정상적으로 작동하지 않을 수 있습니다.
                            </p>
                            <br/>
                            <p>
                                또한 서비스 제공자는 언제든지 애플리케이션 제공을 중단할 수 있으며 별도의 사전 통지 없이 서비스를 종료할 수 있습니다. 별도의 안내가 없는 한 서비스 종료 시 다음 사항이 적용됩니다.
                            </p>
                            <ul>
                                <li>
                                    본 약관에 따라 귀하에게 부여된 모든 권리와 라이선스는 종료됩니다.
                                </li>
                                <li>
                                    귀하는 애플리케이션 사용을 중단해야 하며, 필요한 경우 기기에서 애플리케이션을 삭제해야 합니다.
                                </li>
                            </ul>
                            <strong>
                                준거법 및 관할권
                            </strong>
                            <br/>
                            <p>
                                본 이용약관은 서비스 제공자가 설립된 국가 또는 지역의 법률에 따라 해석되고 적용되며, 법률 충돌 규정은 적용되지 않습니다. 단, 관련 소비자 보호법이 우선 적용되는 경우에는 해당 법률이 우선합니다.
                            </p>
                            <br/>
                            <p>
                                본 약관과 관련하여 발생하는 모든 분쟁은 관련 법률에 따라 관할권을 가지는 법원에서 해결됩니다. 본 조항은 관련 강행법규에 따라 귀하가 행사할 수 있는 권리를 제한하지 않습니다.
                            </p>
                            <br/>
                            <strong>
                                DSA 준수 (디지털 서비스법)
                            </strong>
                            <br/>
                            <p>
                                본 애플리케이션이 디지털 서비스법(유럽연합 규정 (EU) 2022/2065, 이하 "DSA")에서 정의하는 중개 서비스에 해당하는 경우, 아래 규정이 추가로 적용됩니다.
                            </p>
                            <br/>
                            <p>
                                <strong>
                                    연락 창구:
                                </strong>
                                서비스 제공자는 유럽연합 기관 및 서비스 이용자와 직접 연락할 수 있는 단일 연락 창구를 운영하며, 연락처는 dg2620628@daegun.hs.kr 입니다. 서비스 제공자가 유럽연합 외부에 설립된 경우 DSA 제13조에 따라 유럽연합 내 법적 대리인이 지정될 수 있습니다.
                            </p>
                            <br/>
                            <br/>
                            <p>
                                <strong>
                                    콘텐츠 관리 및 사유 통지:
                                </strong>
                                서비스 제공자가 콘텐츠 접근을 제한하거나 계정을 정지 또는 종료하거나 서비스 기능의 이용을 제한하는 경우, 영향을 받는 사용자에게 명확하고 구체적인 사유를 제공합니다. 여기에는 제한 조치의 내용, 법적 또는 계약상 근거, 이용 가능한 구제 절차에 대한 정보가 포함됩니다.
                            </p>
                            <br/>
                            <p>
                                <strong>
                                    신고 및 조치:
                                </strong>
                                사용자 및 제3자는 본 약관에 명시된 연락처를 통해 불법 콘텐츠 신고를 제출할 수 있습니다. 서비스 제공자는 신고 내용을 신속하고 성실하게 처리하며, 필요한 경우 자동화된 의사결정 대신 사람의 검토를 수행합니다.
                            </p>
                            <br/>
                            <p>
                                <strong>
                                    법원 외 분쟁 해결:
                                </strong>
                                콘텐츠 제한 또는 계정 정지와 관련된 분쟁은 관련 법률에 따라 인증된 법원 외 분쟁 해결 기관에 제출될 수 있습니다. 서비스 제공자는 해당 기관과 성실하게 협력합니다. 다만 이는 귀하의 사법적 구제 수단을 제한하지 않습니다.
                            </p>
                            <br/>
                            <p>
                                <strong>
                                    투명성 보고:
                                </strong>
                                서비스 제공자는 콘텐츠 관리 활동, 신고 건수, 조치 내역 및 자동화 수단 사용 현황 등을 포함하는 투명성 보고서를 정기적으로 작성할 수 있습니다. 보고서는 요청 시 dg2620628@daegun.hs.kr 을 통해 제공됩니다.
                            </p>
                            <br/>
                            <p>
                                위 DSA 관련 조항은 애플리케이션이 DSA상 중개 서비스에 해당하는 경우에만 적용되며, 소비자 보호법 또는 개인정보 보호법에 따른 권리와 의무를 대체하거나 제한하지 않습니다.
                            </p>
                            <br/>
                            <strong>
                                조항의 독립성
                            </strong>
                            <p>
                                본 이용약관의 일부 조항이 법원에 의해 무효, 위법 또는 집행 불가능하다고 판단되는 경우에도 해당 조항은 필요한 최소 범위 내에서만 수정되며, 나머지 조항은 계속하여 유효하게 적용됩니다.
                            </p>
                            <br/>
                            <strong>
                                전체 합의
                            </strong>
                            <p>
                                본 이용약관과 개인정보 처리방침은 애플리케이션 사용과 관련하여 귀하와 서비스 제공자 간의 완전한 합의를 구성하며, 이전의 모든 계약 또는 이해를 대체합니다.
                            </p>
                            <br/>
                            <strong>
                                이용약관 변경
                            </strong>
                            <p>
                                서비스 제공자는 필요에 따라 본 이용약관을 변경할 수 있습니다. 따라서 사용자는 정기적으로 본 페이지를 확인하시기 바랍니다. 변경된 약관은 본 페이지에 게시함으로써 공지됩니다.
                            </p>
                            <br/>
                            <p>
                                이전 버전의 이용약관은 서비스 제공자(dg2620628@daegun.hs.kr)에게 요청하여 제공받을 수 있습니다.
                            </p>
                            <br/>
                            <p>
                                본 이용약관은 2026년 6월 24일부터 적용됩니다.
                            </p>
                            <br/>
                            <strong>
                                문의하기
                            </strong>
                            <p>
                                본 이용약관에 대한 질문이나 의견이 있으신 경우 dg2620628@daegun.hs.kr 로 문의하여 주시기 바랍니다.
                            </p>
                        </div>
                    </div>
                    <div className="direct-signup">
                        이미 계정이 있으시다면?&nbsp;<Link to="/login"><span>로그인하러 가기</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;