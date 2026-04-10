import moodDal from './mood.dal.js';

class MoodController {
    updateMood = async (req, res) => {
        try {
            const { date, emoji } = req.body;
            const { user_id } = req;
            await moodDal.saveMood(user_id, date, emoji);
            res.status(200).json({ message: 'Mood updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update mood' });
        }
    };

    deleteMood = async (req, res) => {
        try {
            const { date } = req.params;
            const { user_id } = req;
            await moodDal.deleteMood(user_id, date);
            res.status(200).json({ message: 'Mood deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete mood' });
        }
    };
}

export default new MoodController();
