import React from 'react';
import './MoodSelector.css';

const MoodSelector = ({ currentMood, onSelect }) => {
    const emojis = ['😊', '🤩', '😐', '😔', '😫', '😡', '😭'];

    return (
        <div className="mood-selection-modal">
            <div className="mood-emojis-row">
                {emojis.map(emoji => (
                    <button
                        key={emoji}
                        className={`mood-btn-large ${currentMood === emoji ? 'active' : ''}`}
                        onClick={() => onSelect(emoji)}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;
