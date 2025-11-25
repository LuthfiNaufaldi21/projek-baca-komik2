import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api"; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                localStorage.removeItem("komikita-token");
                localStorage.removeItem("komikita-user");
                setIsLoggedIn(false);
                setUser(null);
                return null;
            }

            const userData = await response.json();
            
            localStorage.setItem("komikita-user", JSON.stringify(userData));
            setUser(userData);
            setIsLoggedIn(true);
            return userData;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            localStorage.removeItem("komikita-token");
            localStorage.removeItem("komikita-user");
            setIsLoggedIn(false);
            setUser(null);
            return null;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("komikita-token");
        
        const initializeAuth = async () => {
            if (storedToken) {
                await fetchProfile(storedToken); 
            }
            setIsLoading(false); 
        };
        
        initializeAuth();
    }, []);

    const register = async (username, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.msg || 'Registrasi gagal, coba lagi.');
            }
            return { success: true, msg: data.msg || 'Registrasi Berhasil!' };

        } catch (error) {
            return { success: false, msg: error.message };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Login gagal, periksa email dan password.');
            }
            
            localStorage.setItem("komikita-token", data.token); 
            
            const fullUser = await fetchProfile(data.token);
            
            if (!fullUser) {
                throw new Error('Gagal memuat profil setelah login.');
            }

            return { success: true, user: fullUser };

        } catch (error) {
            return { success: false, msg: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem("komikita-token");
        localStorage.removeItem("komikita-user");
        setUser(null);
        setIsLoggedIn(false);
    };

    const toggleBookmarkApi = async (comicId) => {
        if (!isLoggedIn || !user) return;
        const token = localStorage.getItem("komikita-token");

        try {
            const response = await fetch(`${API_BASE_URL}/user/bookmark`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ comicId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Gagal mengubah status bookmark.');
            }

            await fetchProfile(token);
            
            return { success: true, msg: data.msg };

        } catch (error) {
            return { success: false, msg: error.message };
        }
    };

    const isBookmarked = (comicId) => {
        if (!user || !user.bookmarks) return false;
        const targetId = String(comicId);
        return user.bookmarks.some(b => String(b.comicId) === targetId); 
    };

    const addBookmark = (comicId) => toggleBookmarkApi(comicId);
    const removeBookmark = (comicId) => toggleBookmarkApi(comicId);
    
    const updateReadingHistory = async (comicId, chapterId) => {
        if (!isLoggedIn || !user) return;
        const token = localStorage.getItem("komikita-token");

        try {
            const response = await fetch(`${API_BASE_URL}/user/history`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ comicId, chapterId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Gagal menyimpan riwayat bacaan.');
            }

            await fetchProfile(token); 
            
            return { success: true, msg: data.msg };

        } catch (error) {
            return { success: false, msg: error.message };
        }
    };

    const getReadingHistory = () => {
        if (!isLoggedIn || !user) return {};
        return user.readingHistory || {};
    };

    const updateProfile = async (profileData) => {
        if (!isLoggedIn || !user) return { success: false, msg: "User belum login." };
        const token = localStorage.getItem("komikita-token");

        try {
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Gagal memperbarui profil.');
            }

            const updatedUser = await fetchProfile(token); 
            
            return { success: true, user: updatedUser, msg: data.msg };

        } catch (error) {
            return { success: false, msg: error.message };
        }
    };

    const uploadAvatar = async (file) => {
        if (!isLoggedIn || !user) return { success: false, msg: "User belum login." };
        const token = localStorage.getItem("komikita-token");

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${API_BASE_URL}/user/avatar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengunggah foto profil.');
            }

            const updatedUser = await fetchProfile(token);

            return { success: true, avatarUrl: updatedUser.avatar, msg: data.message };

        } catch (error) {
            return { success: false, msg: error.message };
        }
    };
    
    // 🎯 FUNGSI BARU: UPDATE PASSWORD (API INTEGRATED) 🎯
    const updatePassword = async ({ oldPassword, newPassword }) => {
        if (!isLoggedIn) return { success: false, msg: "User belum login." };
        const token = localStorage.getItem("komikita-token");
        
        try {
            const response = await fetch(`${API_BASE_URL}/user/password`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Gagal mengganti password.');
            }

            return { success: true, msg: data.msg }; 
        } catch (error) {
            return { success: false, msg: error.message };
        }
    };


    const value = {
        user,
        isLoggedIn,
        isLoading,
        register,
        login,
        logout,
        toggleBookmarkApi,
        isBookmarked,
        addBookmark,
        removeBookmark,
        updateReadingHistory,
        getReadingHistory,
        updateProfile, 
        uploadAvatar,
        updatePassword, // 👈 EXPOSURE FUNGSI BARU
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};