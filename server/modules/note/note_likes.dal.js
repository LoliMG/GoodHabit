import executeQuery from '../../config/db.js';

class NoteLikesDal {
    toggleLike = async (userId, noteId) => {
        // Check if like already exists
        const checkSql = 'SELECT 1 FROM note_likes WHERE user_id = $1 AND note_id = $2';
        const existing = await executeQuery(checkSql, [userId, noteId]);

        if (existing.length > 0) {
            // Remove like
            await executeQuery('DELETE FROM note_likes WHERE user_id = $1 AND note_id = $2', [userId, noteId]);
            return { liked: false };
        } else {
            // Add like
            await executeQuery('INSERT INTO note_likes (user_id, note_id) VALUES ($1, $2)', [userId, noteId]);
            return { liked: true };
        }
    };

    getLikesForNotes = async (noteIds) => {
        if (!noteIds || noteIds.length === 0) return [];
        const sql = `
            SELECT note_id, COUNT(*) AS likes_count
            FROM note_likes
            WHERE note_id = ANY($1::int[])
            GROUP BY note_id
        `;
        return await executeQuery(sql, [noteIds]);
    };

    getUserLikedNotes = async (userId, noteIds) => {
        if (!noteIds || noteIds.length === 0) return [];
        const sql = `
            SELECT note_id
            FROM note_likes
            WHERE user_id = $1 AND note_id = ANY($2::int[])
        `;
        return await executeQuery(sql, [userId, noteIds]);
    };
}

export default new NoteLikesDal();
