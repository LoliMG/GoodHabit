import React from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageChange, uploading }) => {
    return (
        <div className="image-uploader-container">
            <label className="btn-upload-avatar glass-card">
                <input 
                    type="file" 
                    onChange={onImageChange} 
                    accept="image/*"
                    hidden 
                />
                <span className="icon">📸</span>
                <span className="text">{uploading ? 'Subiendo...' : 'Actualizar Foto'}</span>
            </label>
            <p className="upload-hint">Soporta JPG, PNG o WebP. Máx 2MB.</p>
        </div>
    );
};

export default ImageUploader;
