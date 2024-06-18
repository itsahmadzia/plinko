import React from 'react';
import './App.css';

export default function SliderComponent({ dangerLevel, onSliderChange }) {
    const handleSliderChange = (event) => {
        onSliderChange(event.target.value);
    };

    return (
        <div className="slider-container">
            <label htmlFor="slider" className="slider-label">Danger Level:</label>
            <input
                type="range"
                id="slider"
                className="slider"
                min="1"
                max="10"
                value={dangerLevel}
                onChange={handleSliderChange}
            />
            <div className="slider-value">{dangerLevel}</div>
        </div>
    );
}
