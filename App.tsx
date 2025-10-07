

import React, { useState, useMemo, useCallback, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Disaster, DisasterType, Comment, StoryPreview } from './types';
import { DISASTERS, DISASTER_TYPE_DETAILS, COMMENTS_DATA } from './data/disasters';
import DisasterDetailPanel from './components/DisasterDetailPanel';
import FilterPanel from './components/FilterPanel';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ReportDisasterModal from './components/ReportDisasterModal';
import { FlyToMarker } from './components/FlyToMarker';
import { AuthContext } from './contexts/AuthContext';
import { LocationMarkerIcon } from './components/icons/LocationMarkerIcon';
import { XIcon } from './components/icons/XIcon';
import MapLayerControl from './components/MapLayerControl';

// FIX: Default icon issue with Leaflet.
// This is a common fix for issues with Leaflet's default icon paths not being set correctly,
// which can sometimes cause custom icons to fail as well, leading to invisible markers.
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TILE_LAYERS = [
  {
    name: 'Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  {
    name: 'Topographic',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  },
  {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
];


// Cache icons to avoid creating new L.Icon instances on every render.
const iconCache: { [key in DisasterType]?: L.Icon } = {};
const getIcon = (type: DisasterType) => {
  if (!iconCache[type]) {
    iconCache[type] = new L.Icon({
      iconUrl: DISASTER_TYPE_DETAILS[type].iconUrl,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    });
  }
  return iconCache[type] as L.Icon;
};

export default function App() {
  const [filters, setFilters] = useState<{ type: DisasterType | 'all'; decade: number | 'all' }>({
    type: 'all',
    decade: 'all',
  });
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [allComments, setAllComments] = useState<{ [key: number]: Comment[] }>(COMMENTS_DATA);
  const { user } = useContext(AuthContext);

  // State for disasters
  const [disasters, setDisasters] = useState<Disaster[]>(DISASTERS);
  const [userAddedDisasters, setUserAddedDisasters] = useState<Disaster[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newDisasterLocation, setNewDisasterLocation] = useState<[number, number] | null>(null);
  const [isLocationPickerActive, setIsLocationPickerActive] = useState(false);
  const [activeLayer, setActiveLayer] = useState(TILE_LAYERS[0]);

  const allDisasters = useMemo(() => [...disasters, ...userAddedDisasters], [disasters, userAddedDisasters]);

  const filteredDisasters = useMemo(() => {
    return allDisasters.filter(d => {
      const typeMatch = filters.type === 'all' || d.type === filters.type;
      const year = new Date(d.date).getFullYear();

      // FIX: Refactored filtering logic to be more type-safe and avoid potential issues
      // with applying arithmetic operations on a union type (string | number).
      if (filters.decade === 'all') {
        return typeMatch;
      }
      
      const decadeMatch = year >= filters.decade && year < filters.decade + 10;
      return typeMatch && decadeMatch;
    });
  }, [filters, allDisasters]);

  const handleMarkerClick = useCallback((disaster: Disaster) => {
    setSelectedDisaster(disaster);
  }, []);

  const handlePanelClose = useCallback(() => {
    setSelectedDisaster(null);
  }, []);

  const handleLikeComment = useCallback((disasterId: number, commentId: number) => {
    if (!user) return;

    const updateLikesRecursively = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        let comment = { ...c };
        if (comment.id === commentId) {
          const likedBy = comment.likedBy || [];
          const userIndex = likedBy.indexOf(user.name);

          if (userIndex > -1) {
            comment.likedBy = likedBy.filter(name => name !== user.name);
          } else {
            comment.likedBy = [...likedBy, user.name];
          }
          return comment;
        }

        if (comment.replies) {
          comment.replies = updateLikesRecursively(comment.replies);
        }
        return comment;
      });
    };

    setAllComments(prevAllComments => {
      const disasterComments = prevAllComments[disasterId] || [];
      const updatedDisasterComments = updateLikesRecursively(disasterComments);
      return {
        ...prevAllComments,
        [disasterId]: updatedDisasterComments,
      };
    });
  }, [user, setAllComments]);

  const handleAddStory = useCallback((disasterId: number, newStory: StoryPreview) => {
    const updateStories = (disasters: Disaster[]): Disaster[] => {
        return disasters.map(d =>
            d.id === disasterId
                ? { ...d, stories: [...d.stories, newStory] }
                : d
        );
    };

    if (userAddedDisasters.some(d => d.id === disasterId)) {
        setUserAddedDisasters(prevDisasters => updateStories(prevDisasters));
    } else {
        setDisasters(prevDisasters => updateStories(prevDisasters));
    }

    // Also update the selected disaster to reflect the change immediately
    setSelectedDisaster(prev => {
        if (prev && prev.id === disasterId) {
            return {
                ...prev,
                stories: [...prev.stories, newStory]
            };
        }
        return prev;
    });
  }, [userAddedDisasters]);
  
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setIsLocationPickerActive(false);
    setNewDisasterLocation(null);
  };

  const handleSubmitDisaster = (newDisasterData: Omit<Disaster, 'id'>) => {
    const newDisaster: Disaster = {
        ...newDisasterData,
        id: Date.now(), // Simple unique ID for client-side
    };
    setUserAddedDisasters(prev => [...prev, newDisaster]);
    handleCloseReportModal();
  };
  
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (isLocationPickerActive) {
          setNewDisasterLocation([e.latlng.lat, e.latlng.lng]);
          setIsLocationPickerActive(false);
        }
      },
    });
    return null;
  };


  const decades = useMemo(() => {
    const years = allDisasters.map(d => new Date(d.date).getFullYear());
    const decadeSet = new Set(years.map(y => Math.floor(y / 10) * 10));
    return Array.from(decadeSet).sort((a, b) => b - a);
  }, [allDisasters]);
  
  const TAIWAN_CENTER: [number, number] = [23.97565, 120.9738819];
  
  const mapCursor = isLocationPickerActive ? 'crosshair' : '';

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header onLoginClick={() => setIsAuthModalOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <FilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          decades={decades} 
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
        <main className="flex-1 relative" style={{ cursor: mapCursor }}>
          <MapContainer center={TAIWAN_CENTER} zoom={8} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              key={activeLayer.name}
              attribution={activeLayer.attribution}
              url={activeLayer.url}
            />
            <MapEvents />
            {filteredDisasters.map(disaster => (
              <Marker
                key={disaster.id}
                position={disaster.location}
                icon={getIcon(disaster.type)}
                opacity={0.85}
                eventHandlers={{
                  click: () => handleMarkerClick(disaster),
                  mouseover: (event) => event.target.setOpacity(1),
                  mouseout: (event) => event.target.setOpacity(0.85),
                }}
              >
                <Tooltip sticky className="custom-tooltip">
                  <strong>{disaster.name}</strong>
                  <br />
                  {new Date(disaster.date).toLocaleDateString()}
                </Tooltip>
                <Popup>
                    <div className="text-gray-800">
                        <h3 className="font-bold text-lg">{disaster.name}</h3>
                        <p>{new Date(disaster.date).toLocaleDateString()}</p>
                    </div>
                </Popup>
              </Marker>
            ))}
            {selectedDisaster && <FlyToMarker position={selectedDisaster.location} zoom={12}/>}
            {newDisasterLocation && isReportModalOpen && <Marker position={newDisasterLocation} />}
            <MapLayerControl 
                layers={TILE_LAYERS}
                activeLayer={activeLayer}
                onLayerChange={setActiveLayer}
            />
          </MapContainer>
          <DisasterDetailPanel 
            disaster={selectedDisaster} 
            onClose={handlePanelClose}
            allComments={allComments}
            setAllComments={setAllComments}
            onLikeComment={handleLikeComment}
            onAddStory={handleAddStory}
          />
        </main>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ReportDisasterModal
        isOpen={isReportModalOpen}
        isPickingLocation={isLocationPickerActive}
        pickedLocation={newDisasterLocation}
        onClose={handleCloseReportModal}
        onPickLocation={() => setIsLocationPickerActive(true)}
        onSubmit={handleSubmitDisaster}
      />
      {isLocationPickerActive && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-yellow-500/95 text-black p-4 rounded-lg shadow-2xl z-[1020] flex items-center space-x-4 animate-pulse">
          <LocationMarkerIcon className="h-8 w-8 flex-shrink-0" />
          <div className="flex-grow">
            <h3 className="font-bold">選擇災害地點</h3>
            <p className="text-sm">請直接點擊地圖上的確切位置來放置標記。</p>
          </div>
          <button 
            onClick={() => setIsLocationPickerActive(false)} 
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition" 
            aria-label="取消選擇地點"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}