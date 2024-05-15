import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import './Person.scss';
import { useSelector, useDispatch } from 'react-redux';
import withBase from '../../hocs/withBase';
import { FaRegUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { updateUser, uploadUserProfilePicture } from '../../api/user';
import { getUser } from '../../redux/slice/userSlice';
import { useDropzone } from 'react-dropzone';

function Personal({ navigate }) {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [valueUser, setValueUser] = useState({
        name: '',
        phone: '',
        address: '',
    });
    const [file, setFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

    useLayoutEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        setValueUser({
            name: user?.name,
            address: user?.address,
            phone: user?.phone,
        });
        setProfilePicture(user?.profilePicture);
    }, [user]);

    const handleUpdate = async () => {
        try {
            if (!valueUser.name || !valueUser.address || !valueUser.phone) {
                toast.warning('Bạn phải điền đầy đủ thông tin');
            } else {
                const res = await updateUser(user._id, valueUser);
                if (res?.success) {
                    if (file) {
                        const uploadRes = await uploadUserProfilePicture(user._id, file);
                        if (uploadRes?.data?.success) {
                            toast.success('Cập nhật và upload ảnh thành công');
                            setProfilePicture(uploadRes.data.user.profilePicture);
                            dispatch(getUser(uploadRes.data.user));
                        }
                    } else {
                        toast.success('Cập nhật thành công');
                        dispatch(getUser(res.user));
                    }
                }
            }
        } catch (e) {
            console.log(e);
            toast.error('Cập nhật thất bại');
        }
    };

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setProfilePicture(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true });

    const handleIconClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className='personal'>
            <div className='content-personal'>
                <div className='personal--box'>
                    <div className='personal--box--top' onClick={handleIconClick}>
            <span style={{ backgroundImage: `url(${profilePicture})` }} className='profile-picture'>
              {!profilePicture && <FaRegUser className='icon' />}
            </span>
                    </div>
                    <div className='personal--box--bottom'>
            <span>
              <label htmlFor=''>Tên: </label>
              <input
                  defaultValue={user?.name}
                  onChange={(e) => setValueUser({...valueUser, name: e.target.value})}
              />
            </span>
                        {!valueUser?.name && <p className='error-message'>Không được để trống</p>}
                        <span>
              <label htmlFor=''>Số điện thoại: </label>
              <input
                  defaultValue={user?.phone}
                  onChange={(e) => setValueUser({...valueUser, phone: e.target.value})}
              />
            </span>
                        {!valueUser?.phone && <p className='error-message'>Không được để trống</p>}
                        <span>
              <label htmlFor=''>Địa chỉ: </label>
              <input
                  defaultValue={user?.address}
                  onChange={(e) => setValueUser({...valueUser, address: e.target.value})}
              />
            </span>
                        {!valueUser?.address && <p className='error-message'>Không được để trống</p>}
                        <div {...getRootProps()} className='dropzone'>
                            <input {...getInputProps()} id='fileInput'/>
                        </div>
                        <button onClick={handleUpdate} className='btn'>
                            Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withBase(memo(Personal));
