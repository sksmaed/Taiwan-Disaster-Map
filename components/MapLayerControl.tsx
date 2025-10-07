
import React, { useState, useRef, useEffect } from 'react';
import { LayersIcon } from './icons/LayersIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface Layer {
    name: string;
    url: string;
    attribution: string;
}

interface MapLayerControlProps {
    layers: Layer[];
    activeLayer: Layer;
    onLayerChange: (layer: Layer) => void;
}

const MapLayerControl: React.FC<MapLayerControlProps> = ({ layers, activeLayer, onLayerChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLayerSelect = (layer: Layer) => {
        onLayerChange(layer);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="absolute top-24 right-4 z-[1000] leaflet-control">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-gray-700 text-white hover:bg-gray-700 transition"
                aria-label="Change map layer"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <LayersIcon className="h-6 w-6" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
                    <ul className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="map-layer-options">
                        {layers.map((layer) => (
                            <li key={layer.name}>
                                <button
                                    onClick={() => handleLayerSelect(layer)}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                                        activeLayer.name === layer.name
                                            ? 'bg-cyan-600/30 text-cyan-300 font-semibold'
                                            : 'text-gray-200 hover:bg-gray-700'
                                    }`}
                                    role="menuitem"
                                >
                                    <span>{layer.name}</span>
                                    {activeLayer.name === layer.name && (
                                        <CheckCircleIcon className="h-5 w-5 text-cyan-400" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MapLayerControl;
