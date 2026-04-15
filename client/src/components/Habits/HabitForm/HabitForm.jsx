import React from 'react';
import './HabitForm.css';

const HabitForm = ({ 
    name, 
    setName, 
    icon, 
    setIcon, 
    onSubmit, 
    onDelete, 
    availableIcons,
    isEdit,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef
}) => {
    return (
        <form className="edit-habit-form" onSubmit={onSubmit}>
            <div className="form-group">
                <label>Nombre del Hábito</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Beber agua"
                />
            </div>
            
            <div className="form-group">
                <label>Icono</label>
                <div 
                    className="custom-dropdown" 
                    ref={dropdownRef} 
                    style={{ width: '100%' }} 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <div className="dropdown-selected">{icon}</div>
                    {isDropdownOpen && (
                        <div className="dropdown-options">
                            {availableIcons.map(iconItem => (
                                <div
                                    key={iconItem}
                                    className="dropdown-option"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIcon(iconItem);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {iconItem}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="modal-actions">
                {isEdit && (
                    <button type="button" className="btn-danger" onClick={onDelete}>
                        Eliminar
                    </button>
                )}
                <button type="submit" className="btn-primary">
                    {isEdit ? 'Guardar Cambios' : 'Añadir Hábito'}
                </button>
            </div>
        </form>
    );
};

export default HabitForm;
