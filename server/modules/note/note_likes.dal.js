import executeQuery from '../../config/db.js';

class NoteLikesDal {
    toggleLike = async (userId, noteId) => {
        // Check if like already exists
        const checkSql = 'SELECT 1 FROM note_likes WHERE user_id = $1 AND note_id = $2';
        const existing = await executeQuery(checkSql, [userId, noteId]);

        let liked = false;
        if (existing.length > 0) {
            // Remove like
            await executeQuery('DELETE FROM note_likes WHERE user_id = $1 AND note_id = $2', [userId, noteId]);
            liked = false;
        } else {
            // Add like
            await executeQuery('INSERT INTO note_likes (user_id, note_id) VALUES ($1, $2)', [userId, noteId]);
            liked = true;
        }

        // Get updated count
        const countSql = 'SELECT COUNT(*) as likes_count FROM note_likes WHERE note_id = $1';
        const countRes = await executeQuery(countSql, [noteId]);
        const likes_count = parseInt(countRes[0].likes_count);

        return { liked_by_user: liked, likes_count };
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

    // Returns likes count keyed by note date string (YYYY-MM-DD) for all notes owned by userId
    getMyNotesLikes = async (userId) => {
        const sql = `
            SELECT TO_CHAR(dn.note_date, 'YYYY-MM-DD') AS date, COUNT(nl.like_id) AS likes_count
            FROM daily_notes dn
            LEFT JOIN note_likes nl ON nl.note_id = dn.note_id
            WHERE dn.user_id = $1
            GROUP BY dn.note_date
        `;
        return await executeQuery(sql, [userId]);
    };
}

export default new NoteLikesDal();

