import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../components/Modal/Modal';
import HabitHeader from '../../components/Habits/HabitHeader/HabitHeader';
import HabitCard from '../../components/Habits/HabitCard/HabitCard';
import HabitForm from '../../components/Habits/HabitForm/HabitForm';
import './Habits.css';

const Habits = () => {
    const { habits, addHabit, deleteHabit } = useContext(AuthContext);
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [newHabit, setNewHabit] = useState({ name: '', icon: '' });

    const handleAddHabit = () => {
        if (!newHabit.name || !newHabit.icon) return;
        addHabit(newHabit.name, newHabit.icon).then(() => {
            setNewHabit({ name: '', icon: '' });
            setIsIdModalOpen(false);
        });
    };

    const handleDeleteHabit = (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este hábito?")) {
            deleteHabit(id);
        }
    };

    return (
        <div className="habits-page-container">
            <HabitHeader onAddClick={() => setIsIdModalOpen(true)} />

            <main className="habits-grid">
                {habits.length === 0 && (
                    <div className="no-habits-state glass-card">
                        <p>No tienes hábitos registrados. Empieza creando uno nuevo.</p>
                        <button className="btn-add-habit" onClick={() => setIsIdModalOpen(true)}>+</button>
                    </div>
                )}
                
                {habits.map(habit => (
                    <HabitCard 
                        key={habit.id} 
                        habit={habit} 
                        onDelete={handleDeleteHabit} 
                    />
                ))}
            </main>

            <Modal isOpen={isIdModalOpen} onClose={() => setIsIdModalOpen(false)} title="Nuevo hábito" maxWidth="500px">
                <HabitForm 
                    habit={newHabit} 
                    setHabit={setNewHabit} 
                    onSave={handleAddHabit} 
                />
            </Modal>
        </div>
    );
};

export default Habits;
