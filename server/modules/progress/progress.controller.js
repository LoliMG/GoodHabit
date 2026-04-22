import progressDal from './progress.dal.js';

class ProgressController {
    toggle = async (req, res) => {
        try {
            const { habitId, date } = req.body;
            const { user_id } = req;
            await progressDal.toggleProgress([user_id, habitId, date]);
            res.status(200).json({ message: 'Progress toggled' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to toggle progress' });
        }
    };

    activate = async (req, res) => {
        try {
            const { habitId, date } = req.body;
            const { user_id } = req;
            await progressDal.activateProgress([user_id, habitId, date]);
            res.status(200).json({ message: 'Progress activated' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to activate progress' });
        }
    };

    deactivate = async (req, res) => {
        try {
            const { habitId, date } = req.body;
            const { user_id } = req;
            await progressDal.deleteProgress([user_id, habitId, date]);
            res.status(200).json({ message: 'Progress deactivated' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to deactivate progress' });
        }
    };

    getByRange = async (req, res) => {
        try {
            const { start, end } = req.query;
            const { user_id } = req;
            const progress = await progressDal.getProgressByDateRange(user_id, start, end);
            res.status(200).json({ progress });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch progress' });
        }
    };
    
    getStats = async (req, res) => {
        try {
            const { habitId } = req.params;
            const { user_id } = req;
            const count = await progressDal.getHabitStats(user_id, habitId);
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    };
}

export default new ProgressController();
