import noteLikesDal from './note_likes.dal.js';

class NoteLikesController {
    toggleLike = async (req, res) => {
        try {
            const { user_id } = req;
            const { note_id } = req.params;
            const result = await noteLikesDal.toggleLike(user_id, parseInt(note_id));
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to toggle like' });
        }
    };

    getNoteLikes = async (req, res) => {
        try {
            const { note_ids } = req.body; // array of note IDs
            const userId = req.user_id; // may be undefined if not authenticated

            const likesData = await noteLikesDal.getLikesForNotes(note_ids);

            let userLiked = [];
            if (userId) {
                userLiked = await noteLikesDal.getUserLikedNotes(userId, note_ids);
            }

            // Build a map: noteId -> { likesCount, likedByUser }
            const likesMap = {};
            likesData.forEach(row => {
                likesMap[row.note_id] = { likes_count: parseInt(row.likes_count), liked_by_user: false };
            });
            userLiked.forEach(row => {
                if (likesMap[row.note_id]) {
                    likesMap[row.note_id].liked_by_user = true;
                } else {
                    likesMap[row.note_id] = { likes_count: 0, liked_by_user: true };
                }
            });

            res.status(200).json(likesMap);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get likes' });
        }
    };

    // Returns { [date]: likesCount } for all notes owned by the authenticated user
    getMyNotesLikes = async (req, res) => {
        try {
            const { user_id } = req;
            const rows = await noteLikesDal.getMyNotesLikes(user_id);
            // Build map: date -> likes_count
            const result = {};
            rows.forEach(row => {
                result[row.date] = parseInt(row.likes_count);
            });
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get my notes likes' });
        }
    };
}

export default new NoteLikesController();

