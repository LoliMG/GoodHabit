import './HeartButton.css';

const HeartButton = ({ count, isLiked, onClick, readonly = false, className = "" }) => {
    const Component = readonly ? 'div' : 'button';
    
    return (
        <Component 
            className={`heart-button-container ${isLiked ? 'liked' : ''} ${readonly ? 'readonly' : ''} ${className}`}
            onClick={!readonly ? onClick : undefined}
            title={readonly ? "Likes recibidos" : (isLiked ? "Quitar like" : "Dar like")}
        >
            <span className="heart-icon">❤️</span>
            <span className="likes-count">{count || 0}</span>
        </Component>
    );
};

export default HeartButton;
