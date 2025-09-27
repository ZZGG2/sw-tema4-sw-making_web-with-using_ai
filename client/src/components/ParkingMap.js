import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ParkingMap = ({ parkingData }) => {
  // 선택된 주차장만 표시, center도 해당 주차장 위치로
  const hasValidCoords = parkingData && parkingData.length > 0 && parkingData[0].coordinates && !isNaN(parkingData[0].coordinates.lat) && !isNaN(parkingData[0].coordinates.lon);
  const center = hasValidCoords
    ? [parkingData[0].coordinates.lat, parkingData[0].coordinates.lon]
    : [37.555, 128.209];

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {hasValidCoords ? (
          <Marker position={[parkingData[0].coordinates.lat, parkingData[0].coordinates.lon]}>
            <Popup>
              <strong>{parkingData[0].name}</strong><br />
              {parkingData[0].address}<br />
              {parkingData[0].fee}
            </Popup>
          </Marker>
        ) : (
          <Popup position={center}>
            좌표 정보가 없어 지도를 표시할 수 없습니다.
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default ParkingMap;
