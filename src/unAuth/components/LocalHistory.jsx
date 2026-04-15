import { useState, useEffect } from "react";
import "./LocalHistory.css";

const LocalHistory = ({ onSelectVideo }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("yt_history") || "[]");
    setHistory(saved);
  }, []);

  const handleClear = () => {
    localStorage.removeItem("yt_history");
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <section className="history">
      <div className="history__header">
        <h3 className="history__title">Recent Generations</h3>
        <button className="history__clear-btn" onClick={handleClear}>
          Clear All
        </button>
      </div>
      <div className="history__grid">
        {history.map((item) => (
          <article 
            key={item.id} 
            className="history__card" 
            onClick={() => onSelectVideo(item)}
          >
            <div className="history__thumbnail-wrapper">
              <img src={item.thumbnail} alt={item.title} className="history__thumbnail" />
              <div className="history__overlay">
                <span>View Timestamps</span>
              </div>
            </div>
            <h4 className="history__video-title">{item.title}</h4>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LocalHistory;