import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import './styles.css';
import edit from '../../assets/edit.png';
import guest_profile from '../../uploads/guest_profile.png';
import UserManager from '../../server/utils/UserManager';
import SubjectManager from '../../server/utils/SubjectManager';
import Schedule from '../../components/Schedule';
import SelectSubjectPopup from '../../components/selectSubjectPopup';

function MyPage({ user, setUser }) {
    const fileInputRef = useRef(null);
    const [handleUserNameChange, setHandleUserNameChange] = useState(false);
    const [newUserName, setNewUserName] = useState(user.name || "");
    const [items, setItems] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [isSelectSubjectPopupOpen, setIsSelectSubjectPopupOpen] = useState(false);
    const [editingCell, setEditingCell] = useState({ row: null, col: null });
    const [columnIndex, setColumnIndex] = useState(0);
    useEffect(() => {
        let fetchItems = async () => {
            let subjects = await SubjectManager.getAll();
            setSubjectList(subjects.results.list);
            setItems(subjects.results.list.filter(v => v.teacher_id === user.id));
        }
        fetchItems();
    }, [items]);
    const changeUserName = async function() {
        if (!newUserName || newUserName.trim() === '') {
            return alert("이름을 입력해주세요.");
        }
        let res = { ...user, name: newUserName };
        setUser({ ...user, name: newUserName });
        setHandleUserNameChange(false);
        await UserManager.setUser(res);
        return alert("이름이 변경되었습니다.");
    }
    const handleProfileClick = (e) => {
        e.stopPropagation();
        if(!user || !user.id) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        alert("프로필 업로드 중");
        const file = e.target.files[0];
        
        if (!file) return alert("프로필 업로드 실패");

        const formData = new FormData();
        formData.append('file', file);
        formData.append('user', JSON.stringify(user));
        
        let res = await UserManager.uploadProfileImage(formData, user);
        
        setUser({...user, avatar: res.results.url});
        return alert("프로필 업로드 완료");
    };

    return (
        <div className='MyPage'>
            <Helmet>
                <title>출첵커 | 프로필</title>
            </Helmet>
            <SelectSubjectPopup isopen={isSelectSubjectPopupOpen} setIsOpen={setIsSelectSubjectPopupOpen} user={user} setUser={setUser} editingCell={editingCell} />
            <form onSubmit={(e) => e.preventDefault() }>
                <input type="file" name="profileImage" ref={ fileInputRef } onChange={ handleFileChange }style={{ display: "none" }}/>
            </form>
            <div className='profile-tab contents-wrapper'>
                <div className='profile-info-wrapper'>
                    <div className='profile-img' onClick={ handleProfileClick }>
                        <img src={(user && user.avatar) ? user.avatar : guest_profile} alt="Profile" />
                    </div>
                    <div className='name'>
                        {
                            handleUserNameChange ? 
                            <div className="name-box">
                                <input className="new-name-input" type="text" placeholder = " 이름을 입력하세요." value = { newUserName } onChange={e => setNewUserName(e.target.value) }/>
                                <button className="new-name-submit" onClick={async (e) => await changeUserName(e) }>저장</button>
                            </div>:
                            <div className="name-box">
                                <p>{user.isLogin ? user.name : 'Guest'}</p>&nbsp;&nbsp;&nbsp;
                                <img className='edit-icon' src={edit} width='12vh' height='12vh' onClick={() => setHandleUserNameChange(!handleUserNameChange)} />
                            </div>   
                        }
                    </div>
                    <div className='grade'>
                        {user ? user.id : 'N/A'}
                    </div>
                </div>
                <Schedule scheduleData={user.subjects.map(v => v.map(v2 => subjectList.find(x => x.id === v2.id)))} ishided={false} setEditingCell={setEditingCell} setIsSelectSubjectPopupOpen={setIsSelectSubjectPopupOpen} />
            </div>
        </div>
    );
}

export default MyPage;