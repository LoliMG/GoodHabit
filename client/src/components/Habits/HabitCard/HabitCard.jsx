import './HabitCard.css';

const HabitCard = ({ habit, stats, onOpenEdit }) => {
    return (
        <div className="habit-card glass-card" onClick={() => onOpenEdit(habit)}>
            <div className="habit-card-header">
                <span className="icon">{habit.icon}</span>
                <h3>{habit.name}</h3>
            </div>

            <div className="habit-card-divider"></div>

            <div className="habit-card-stats-grid">
                <div className="stat-item">
                    <span className="stat-number">{stats.thisWeek}</span>
                    <span className="stat-text">Este semana</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{stats.thisMonth}</span>
                    <span className="stat-text">Este mes</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{stats.allTime}</span>
                    <span className="stat-text">Totales</span>
                </div>
            </div>
        </div>
    );
};

export default HabitCard;
