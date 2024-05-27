import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import './Person.scss';
import { useSelector, useDispatch } from 'react-redux';
import withBase from '../../hocs/withBase';
import { FaRegUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { updateUser, uploadUserProfilePicture, uploadUserCoverPicture } from '../../api/user';
import { getUser } from '../../redux/slice/userSlice';
import { useDropzone } from 'react-dropzone';
import defaultCoverPicture from '../../styles/image/default-cover.png';
import defaultProfilePicture from '../../styles/image/default-user.webp';

function Personal({ navigate }) {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [valueUser, setValueUser] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [file, setFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [coverPicture, setCoverPicture] = useState(user?.coverPicture || '');

    useLayoutEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        setValueUser({
            name: user?.name,
            phone: user?.phone,
            address: user?.address
        });
        setProfilePicture(user?.profilePicture);
        setCoverPicture(user?.coverPicture);
    }, [user]);

    const handleUpdate = async () => {
        try {
            if (!valueUser.name || !valueUser.phone || !valueUser.address) {
                toast.warning('Bạn phải điền đầy đủ thông tin');
                return;
            }

            const updateUserPromise = updateUser(user._id, valueUser);
            const uploadProfilePicturePromise = file ? uploadUserProfilePicture(user._id, file) : Promise.resolve(null);
            const uploadCoverPicturePromise = coverFile ? uploadUserCoverPicture(user._id, coverFile) : Promise.resolve(null);

            const [updateRes, uploadProfileRes, uploadCoverRes] = await Promise.all([updateUserPromise, uploadProfilePicturePromise, uploadCoverPicturePromise]);

            if (updateRes?.success) {
                if (uploadProfileRes && uploadProfileRes.data?.success) {
                    toast.success('Cập nhật và upload ảnh đại diện thành công');
                    setProfilePicture(uploadProfileRes.data.user.profilePicture);
                    dispatch(getUser(uploadProfileRes.data.user));
                }
                if (uploadCoverRes && uploadCoverRes.data?.success) {
                    toast.success('Cập nhật và upload ảnh bìa thành công');
                    setCoverPicture(uploadCoverRes.data.user.coverPicture);
                    dispatch(getUser(uploadCoverRes.data.user));
                } else if (!uploadProfileRes && !uploadCoverRes) {
                    toast.success('Cập nhật thành công');
                    dispatch(getUser(updateRes.user));
                }
            } else {
                toast.error('Cập nhật thất bại');
            }
        } catch (e) {
            console.log(e);
            toast.error('Cập nhật thất bại');
        }
    };

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const maxFileSize = 2 * 1024 * 1024; // 2MB

        if (file.size > maxFileSize) {
            toast.warning('Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 2MB.');
            setFile(null);
            return;
        }

        setFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setProfilePicture(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const onCoverDrop = (acceptedFiles) => {
        const coverFile = acceptedFiles[0];
        const maxFileSize = 2 * 1024 * 1024; // 2MB

        if (coverFile.size > maxFileSize) {
            toast.warning('Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 2MB.');
            setCoverFile(null);
            return;
        }

        setCoverFile(coverFile);
        const reader = new FileReader();
        reader.onload = () => {
            setCoverPicture(reader.result);
        };
        reader.readAsDataURL(coverFile);
    };

    const { getRootProps, getInputProps, open } = useDropzone({ onDrop, noClick: true });
    const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, open: openCover } = useDropzone({ onDrop: onCoverDrop, noClick: true });

    const handleIconClick = () => {
        open();
    };

    const handleCoverClick = () => {
        openCover();
    };

    return (
        <div className='personal'>
            <div {...getCoverRootProps()} className='cover-container' onClick={handleCoverClick}>
                <input {...getCoverInputProps()} />
                <img src={coverPicture || defaultCoverPicture} alt="Cover" className='cover-picture' />
            </div>
            <div className='content-personal'>
                <div className='personal--box'>
                    <div className='personal--box--top' onClick={handleIconClick}>
                        <span style={{ backgroundImage: `url(${profilePicture || defaultProfilePicture})` }} className='profile-picture'>
                            {!profilePicture }
                        </span>
                    </div>
                    <div className='personal--box--bottom'>
                        <span>
                            <label htmlFor=''>Tên: </label>
                            <input
                                defaultValue={user?.name}
                                onChange={(e) => setValueUser({ ...valueUser, name: e.target.value })}
                            />
                        </span>
                        {!valueUser?.name && <p className='error-message'>Không được để trống</p>}
                        <span>
                            <label htmlFor=''>Số điện thoại: </label>
                            <input
                                defaultValue={user?.phone}
                                onChange={(e) => setValueUser({ ...valueUser, phone: e.target.value })}
                            />
                        </span>
                        {!valueUser?.phone && <p className='error-message'>Không được để trống</p>}
                        <span>
                            <label htmlFor=''>Địa chỉ: </label>
                            <input
                                defaultValue={user?.address}
                                onChange={(e) => setValueUser({ ...valueUser, address: e.target.value })}
                            />
                        </span>
                        {!valueUser?.address && <p className='error-message'>Không được để trống</p>}
                        <div {...getRootProps()} className='dropzone'>
                            <input {...getInputProps()} id='fileInput' />
                        </div>
                        <div style={{display: "inline-block"}}>
                            <button onClick={handleUpdate} className='btn-update'>
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withBase(memo(Personal));
