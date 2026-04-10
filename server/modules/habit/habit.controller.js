import habitDal from './habit.dal.js';

class HabitController {
    createHabit = async (req, res) => {
        try {
            const { name, icon } = req.body;
            const { user_id } = req;
            const result = await habitDal.addHabit([user_id, name, icon]);
            res.status(200).json({ message: 'Habit created', habitId: result[0].habit_id });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create habit' });
        }
    };

    getHabits = async (req, res) => {
        try {
            const { user_id } = req;
            const habits = await habitDal.getHabitsByUserId(user_id);
            res.status(200).json({ habits });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch habits' });
        }
    };

    updateHabit = async (req, res) => {
        try {
            const { id, name, icon } = req.body;
            const { user_id } = req;
            await habitDal.updateHabit([name, icon, id, user_id]);
            res.status(200).json({ message: 'Habit updated' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update habit' });
        }
    };

    deleteHabit = async (req, res) => {
        try {
            const { id } = req.params;
            const { user_id } = req;
            await habitDal.deleteHabit(id, user_id);
            res.status(200).json({ message: 'Habit deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete habit' });
        }
    };

    // One-Time Logic
    createOneTime = async (req, res) => {
        try {
            const { name, date } = req.body;
            const { user_id } = req;
            const result = await habitDal.addOneTimeHabit([user_id, name, date]);
            res.status(200).json({ message: 'One-time habit added', othId: result[0].oth_id });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add one-time habit' });
        }
    };

    getOneTime = async (req, res) => {
        try {
            const { date } = req.query;
            const { user_id } = req;
            const habits = await habitDal.getOneTimeHabits(user_id, date);
            res.status(200).json({ habits });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch one-time habits' });
        }
    };

    toggleOneTime = async (req, res) => {
        try {
            const { id } = req.params;
            const { user_id } = req;
            await habitDal.toggleOneTimeHabit(id, user_id);
            res.status(200).json({ message: 'Status toggled' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to toggle status' });
        }
    };
}

export default new HabitController();
