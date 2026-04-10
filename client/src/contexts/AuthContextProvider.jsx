import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { fetchData } from "../helpers/axiosHelper";

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const [habits, setHabits] = useState([]);
    const [oneTimeHabits, setOneTimeHabits] = useState({});
    const [progress, setProgress] = useState({});
    const [notes, setNotes] = useState({});
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const formatNotes = (notesArray) => {
        if (!Array.isArray(notesArray)) return notesArray || {};
        const formatted = {};
        notesArray.forEach(n => {
            const dateStr = typeof n.date === 'string' ? n.date.split('T')[0] : n.date.toISOString().split('T')[0];
            formatted[dateStr] = n.content;
        });
        return formatted;
    };

    const formatProgress = (progressArray) => {
        if (!Array.isArray(progressArray)) return progressArray || {};
        const formatted = {};
        progressArray.forEach(p => {
            const dateStr = typeof p.date === 'string' ? p.date.split('T')[0] : p.date.toISOString().split('T')[0];
            if (!formatted[dateStr]) formatted[dateStr] = {};
            formatted[dateStr][p.habit_id] = true;
        });
        return formatted;
    };

    const formatOneTimeHabits = (othArray) => {
        if (!Array.isArray(othArray)) return othArray || {};
        const formatted = {};
        othArray.forEach(h => {
            const dateStr = typeof h.date === 'string' ? h.date.split('T')[0] : h.date.toISOString().split('T')[0];
            if (!formatted[dateStr]) formatted[dateStr] = [];
            formatted[dateStr].push({ id: h.id, name: h.name, icon: "📌", isOneTime: true, isCompleted: !!h.is_completed });
        });
        return formatted;
    };

    useEffect(() => {
        const tokenLS = localStorage.getItem("token");

        if (tokenLS) {
            const fetchUser = async () => {
                try {
                    const resUser = await fetchData("/user/userByToken", "GET", null, tokenLS);
                    setToken(tokenLS);
                    setUser(resUser.data.user);
                    setHabits(resUser.data.habits || []);
                    setOneTimeHabits(formatOneTimeHabits(resUser.data.oneTimeHabits));
                    setProgress(formatProgress(resUser.data.progress));
                    setNotes(formatNotes(resUser.data.notes));
                } catch (error) {
                    console.error("Token checking failed:", error);
                    localStorage.removeItem("token");
                } finally {
                    setIsAuthLoading(false);
                }
            };
            fetchUser();
        } else {
            setIsAuthLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetchData("/user/login", "POST", { email, password });
            setToken(res.data.token);
            setUser(res.data.user);
            setHabits(res.data.habits || []);
            setOneTimeHabits(formatOneTimeHabits(res.data.oneTimeHabits));
            setProgress(formatProgress(res.data.progress));
            setNotes(formatNotes(res.data.notes));
            localStorage.setItem("token", res.data.token);
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || "Error de conexión" };
        }
    };

    const register = async (userData) => {
        try {
            await fetchData("/user/register", "POST", userData);
            return await login(userData.email, userData.password);
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || "Error de conexión" };
        }
    };

    const loginWithGoogle = async (tokenResponse) => {
        try {
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            }).then(res => res.json());

            const userData = {
                googleId: userInfo.sub,
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture // not saved in db right now, but optional
            };

            const res = await fetchData("/user/googleLogin", "POST", userData);
            if (res.ok) {
                setToken(res.data.token);
                setUser(res.data.user);
                setHabits(res.data.habits || []);
                setOneTimeHabits(formatOneTimeHabits(res.data.oneTimeHabits));
                setProgress(formatProgress(res.data.progress));
                setNotes(formatNotes(res.data.notes));
                localStorage.setItem("token", res.data.token);
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || "Error al conectar con Google o Servidor" };
        }
    };

    const logout = () => {
        setUser();
        setToken();
        setNotes({});
        localStorage.removeItem("token");
    };

    const updateUserProfile = async (userData) => {
        try {
            await fetchData("/user/editUser", "PUT", userData, token);
            setUser(prev => ({ ...prev, ...userData }));
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || "Error al actualizar" };
        }
    };

    const addHabit = async (name, icon) => {
        try {
            const res = await fetchData("/habit/add", "POST", { name, icon }, token);
            setHabits([...habits, { id: res.data.habitId, name, icon }]);
        } catch (error) {
            console.error(error);
        }
    };

    const updateHabit = async (id, name, icon) => {
        try {
            await fetchData("/habit/update", "PUT", { id, name, icon }, token);
            setHabits(habits.map(h => h.id === id ? { ...h, name, icon } : h));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteHabit = async (id) => {
        try {
            await fetchData(`/habit/${id}`, "DELETE", null, token);
            setHabits(habits.filter(h => h.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const addOneTimeHabit = async (date, name) => {
        try {
            const res = await fetchData("/habit/one-time", "POST", { name, date }, token);
            const newHabit = { id: res.data.othId, name, icon: "📌", isOneTime: true, isCompleted: false };
            setOneTimeHabits(prev => ({
                ...prev,
                [date]: [...(prev[date] || []), newHabit]
            }));
        } catch (error) {
            console.error(error);
        }
    };
    
    const deleteOneTimeHabit = async (date, id) => {
        try {
            await fetchData(`/habit/one-time/${id}`, "DELETE", null, token);
            setOneTimeHabits(prev => ({
                ...prev,
                [date]: (prev[date] || []).filter(h => h.id !== id)
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleHabitProgress = async (date, habitId, isOneTime = false) => {
        try {
            if (isOneTime) {
                await fetchData(`/habit/one-time/${habitId}`, "PUT", null, token);
                setOneTimeHabits(prev => {
                    const dayOT = prev[date] || [];
                    const newDayOT = dayOT.map(h => h.id === habitId ? { ...h, isCompleted: !h.isCompleted } : h);
                    return { ...prev, [date]: newDayOT };
                });
            } else {
                await fetchData("/progress/toggle", "POST", { habitId, date }, token);
                setProgress(prev => {
                    const dayProgress = prev[date] || {};
                    const newDayProgress = { ...dayProgress, [habitId]: !dayProgress[habitId] };
                    return { ...prev, [date]: newDayProgress };
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateDayNote = async (date, content) => {
        try {
            await fetchData("/note/save", "POST", { date, content }, token);
            setNotes(prev => ({ ...prev, [date]: content }));
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    };

    const deleteDayNote = async (date) => {
        try {
            await fetchData("/note/delete", "DELETE", { date }, token);
            setNotes(prev => {
                const updated = { ...prev };
                delete updated[date];
                return updated;
            });
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    };

    console.log("user global", user);
    console.log("token global", token);

    return (
        <AuthContext.Provider value={{
            user, setUser, token, setToken, logout, login, loginWithGoogle, register, updateUserProfile,
            habits, setHabits, addHabit, updateHabit, deleteHabit,
            oneTimeHabits, setOneTimeHabits, addOneTimeHabit, deleteOneTimeHabit,
            progress, setProgress, toggleHabitProgress, isAuthLoading,
            notes, updateDayNote, deleteDayNote
        }}>
            {children}
        </AuthContext.Provider>
    );
};