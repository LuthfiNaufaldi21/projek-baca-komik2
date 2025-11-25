import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiUploadCloud, FiCamera } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth'; 

export default function UploadAvatarModal({ onClose, onSaveSuccess }) {
  const { uploadAvatar, isLoading } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const isUploading = isLoading; 
  const avatarPlaceholderColor = '#6366f1'; 

  // Fix: Mengunci scroll background saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    setError(null);
    const file = event.target.files[0];
    if (!file) {
        setSelectedFile(null);
        setPreviewUrl('');
        return;
    };

    if (file.size > 2 * 1024 * 1024) { 
      setError("Ukuran file maksimal 2MB.");
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      return;
    }

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!acceptedTypes.includes(file.type)) {
      setError("Hanya file JPG/JPEG atau PNG yang diizinkan.");
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl); 
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    const result = await uploadAvatar(selectedFile);

    if (result.success) {
      alert(result.msg || "Foto profil berhasil diubah!");
      onSaveSuccess();
    } else {
      setError(result.msg || "Gagal mengunggah: Terjadi kesalahan server.");
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  return (
    <div 
        className="modal-overlay" 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} 
        onClick={onClose}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
            maxWidth: '350px', // Sedikit diperkecil
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            position: 'relative'
        }}
      >
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 className="modal-title" style={{ margin: 0, fontSize: '1.25rem' }}>Ganti Foto Profil</h4>
          <button onClick={onClose} className="modal-close-btn" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            <FiX />
          </button>
        </div>
        
        <div className="modal-body" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
            style={{ display: 'none' }} 
          />
          
          {/* Avatar Preview */}
          <div className="avatar-preview-container" style={{ margin: '15px auto 20px auto', width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${avatarPlaceholderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                <FiCamera size={40} />
              </div>
            )}
          </div>

          {/* Tombol Pilih Gambar */}
          <button 
            onClick={handleChooseFile} 
            style={{ 
                padding: '10px 20px', 
                borderRadius: '5px', 
                backgroundColor: '#f0f0f0', 
                color: '#333', 
                border: '1px solid #ccc',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center',
                marginBottom: '10px'
            }}
            disabled={isUploading}
          >
            <FiCamera size={18} /> 
            Pilih Gambar
          </button>
          
          {/* Tampilkan nama file */}
          {selectedFile && (
            <p style={{ fontSize: '0.9em', color: '#555', margin: '0 0 15px 0', wordBreak: 'break-all' }}>
                File terpilih: **{selectedFile.name}**
            </p>
          )}

          {error && (
            <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>{error}</p>
          )}

        </div>
        
        <div className="modal-footer" style={{ borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                opacity: (!selectedFile || isUploading) ? 0.6 : 1,
            }}
          >
            {isUploading ? 'Mengunggah...' : <><FiUploadCloud /> Unggah Profil</>}
          </button>
        </div>
      </div>
    </div>
  );
}