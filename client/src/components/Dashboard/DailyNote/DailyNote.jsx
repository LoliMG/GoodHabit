import Button from '../../UI/Button/Button';
import './DailyNote.css';

const DailyNote = ({ currentNote, setCurrentNote, onSave, onDelete, hasNote }) => {
    const isNoteEmpty = !currentNote || currentNote.trim().length === 0;

    return (
        <div className="daily-note-section glass-card" style={{ marginTop: 0 }}>
            <textarea
                className="note-textarea"
                placeholder="Escribe una pequeña reflexión..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
            />
            <div className="note-actions">
                {hasNote && (
                    <Button
                        variant="danger"
                        onClick={onDelete}
                    >
                        Eliminar
                    </Button>
                )}
                <Button
                    onClick={onSave}
                    disabled={isNoteEmpty}
                >
                    Guardar Nota
                </Button>
            </div>
        </div>
    );
};

export default DailyNote;
