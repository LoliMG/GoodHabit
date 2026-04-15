import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import UserProfileHeader from '../../components/User/UserProfileHeader/UserProfileHeader';
import ProfileSettings from '../../components/User/ProfileSettings/ProfileSettings';
import ImageUploader from '../../components/User/ImageUploader/ImageUploader';
import './Profile.css';

const Profile = () => {
    const { user, updateUserProfile, updateUserImage } = useContext(AuthContext);
    const [userName, setUserName] = useState(user?.user_name || '');
    const [newPassword, setNewPassword] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleUpdate = async () => {
        const result = await updateUserProfile({ user_name: userName, password: newPassword });
        if (result.success) {
            alert("Perfil actualizado correctamente");
            setNewPassword("");
        } else {
            alert(result.message);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        const result = await updateUserImage(formData);
        setUploading(false);

        if (result.success) alert("Imagen actualizada");
        else alert(result.message);
    };

    return (
        <div className="profile-page-container">
            <UserProfileHeader user={user} />

            <main className="profile-main-grid">
                <div className="settings-column">
                    <ProfileSettings 
                        userName={userName} 
                        setUserName={setUserName} 
                        newPassword={newPassword} 
                        setNewPassword={setNewPassword} 
                        onUpdate={handleUpdate} 
                    />
                </div>
                
                <div className="uploader-column">
                    <ImageUploader 
                        onImageChange={handleImageChange} 
                        uploading={uploading} 
                    />
                </div>
            </main>
        </div>
    );
};

export default Profile;
