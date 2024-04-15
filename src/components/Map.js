import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapBox_API } from './../helpers/ipAddress.js';
import geoJson from '../assets/json_data/GeoJson/stagnentData.json';

const MapboxComponent = () => {
    const MapBoxAPIKey = getMapBox_API();

    useEffect(() => {
        mapboxgl.accessToken = MapBoxAPIKey;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-95.08148549138448, 29.564911887991144],
            zoom: 17.5
        });

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('load', function () {
            map.addSource('geojson-source', {
                type: 'geojson',
                data: geoJson
            });

            geoJson.features.forEach((feature, index) => {
                if (feature.properties.mapbounds) return; // Skip map bounds or similar features

                const layerId = `${feature.geometry.type.toLowerCase()}-layer-${index}`;
                const layerType = feature.geometry.type === 'Point' ? 'circle' : feature.geometry.type === 'LineString' ? 'line' : 'fill';

                map.addLayer({
                    id: layerId,
                    type: layerType,
                    source: 'geojson-source',
                    filter: ['==', ['id'], feature.id],
                    paint: {
                        'circle-radius': 6,
                        'circle-color': feature.properties['marker-color'] || '#FF0000',
                        'fill-color': feature.properties.fill || '#888888',
                        'fill-opacity': feature.properties['fill-opacity'] || 0.5,
                        'line-color': feature.properties.stroke || '#888888',
                        'line-width': feature.properties['stroke-width'] || 2
                    }
                });

                map.on('mouseenter', layerId, (e) => {
                    if (!e.features[0]) return;
                    map.getCanvas().style.cursor = 'pointer';
                    
                    let coordinates;
                    if (feature.geometry.type === 'Point') {
                        coordinates = e.features[0].geometry.coordinates.slice();
                    } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
                        coordinates = e.features[0].geometry.coordinates[0][0];
                    } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
                        coordinates = e.features[0].geometry.coordinates[0];
                    }
                    
                    const description = e.features[0].properties.Name || 'No description available';

                    popup.setLngLat(coordinates)
                         .setHTML(description)
                         .addTo(map);
                });

                map.on('mouseleave', layerId, () => {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                });
            });
        });

        return () => map.remove(); // Clean up the map instance
    });

    return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
};

export default MapboxComponent;
