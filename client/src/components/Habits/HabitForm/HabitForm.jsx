import Button from '../../UI/Button/Button';
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
                <div className="icon-selector-grid">
                    {availableIcons.map(iconItem => (
                        <div
                            key={iconItem}
                            className={`icon-grid-item ${icon === iconItem ? 'active' : ''}`}
                            onClick={() => setIcon(iconItem)}
                        >
                            {iconItem}
                        </div>
                    ))}
                </div>
            </div>

            <div className="modal-actions">
                {isEdit && (
                    <Button variant="danger" onClick={onDelete}>
                        Eliminar
                    </Button>
                )}
                <Button type="submit">
                    {isEdit ? 'Guardar Cambios' : 'Añadir Hábito'}
                </Button>
            </div>
        </form>
    );
};

export default HabitForm;
