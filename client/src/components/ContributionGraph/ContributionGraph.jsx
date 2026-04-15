import React from 'react';
import './ContributionGraph.css';

const ContributionGraph = ({ data = {} }) => {
    const weeks = Array.from({ length: 53 }, (_, i) => i);
    const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    const monthLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

    return (
        <div className="contribution-container glass-card">
            <div className="month-labels">
                {monthLabels.map(m => <span key={m}>{m}</span>)}
            </div>
            <div className="graph-body">
                <div className="day-labels">
                    {dayLabels.map((d, i) => <span key={i}>{d}</span>)}
                </div>
                <div className="weeks-grid">
                    {weeks.map(w => (
                        <div key={w} className="week-column">
                            {Array.from({ length: 7 }).map((_, d) => {
                                // Dummy intensity for demo
                                const intensity = Math.floor(Math.random() * 5);
                                return (
                                    <div
                                        key={d}
                                        className={`cell lvl-${intensity}`}
                                        title={`Week ${w}, Day ${d}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <div className="graph-footer">
                <span>Less</span>
                <div className="legend">
                    <div className="cell lvl-0"></div>
                    <div className="cell lvl-1"></div>
                    <div className="cell lvl-2"></div>
                    <div className="cell lvl-3"></div>
                    <div className="cell lvl-4"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ContributionGraph;
