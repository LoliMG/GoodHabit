import noteDal from './note.dal.js';

class NoteController {
    saveNote = async (req, res) => {
        try {
            const { date, content, mood } = req.body;
            const { user_id } = req;
            await noteDal.saveNote(user_id, date, content, mood);
            res.status(200).json({ message: 'Note saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to save note' });
        }
    };

    updateMood = async (req, res) => {
        try {
            const { date, mood } = req.body;
            const { user_id } = req;
            await noteDal.updateMood(user_id, date, mood);
            res.status(200).json({ message: 'Mood updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update mood' });
        }
    };

    deleteNote = async (req, res) => {
        try {
            const { date } = req.body;
            const { user_id } = req;
            await noteDal.deleteNote(user_id, date);
            res.status(200).json({ message: 'Note deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete note' });
        }
    };
}

export default new NoteController();
