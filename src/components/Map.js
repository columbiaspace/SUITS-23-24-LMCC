import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapBox_API } from './../helpers/ipAddress.js';
import geoJson from '../assets/json_data/GeoJson/mapData.json';

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

        map.on('load', function () {
            map.addSource('geojson-source', {
                type: 'geojson',
                data: geoJson
            });

            // Add layers based on feature type
            geoJson.features.forEach((feature, index) => {
                if (feature.geometry.type === 'Point') {
                    // Add a layer for point features
                    map.addLayer({
                        id: `point-layer-${index}`,
                        type: 'circle',
                        source: 'geojson-source',
                        filter: ['==', ['id'], feature.id],
                        paint: {
                            'circle-radius': 6,
                            'circle-color': feature.properties['marker-color'] || '#FF0000'
                        }
                    });

                    // Event listener for showing popup on hover
                    map.on('mouseenter', `point-layer-${index}`, (e) => {
                        // Change the cursor style as a UI indicator.
                        map.getCanvas().style.cursor = 'pointer';

                        const coordinates = e.features[0].geometry.coordinates.slice();
                        const description = e.features[0].properties.Name; // Customize this based on what you want to show

                        // Populate the popup and set its coordinates
                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(description)
                            .addTo(map);
                    });

                    map.on('mouseleave', `point-layer-${index}`, () => {
                        map.getCanvas().style.cursor = '';
                         // Nothing Here, Remove the popup when the mouse leaves the feature
                    });
                } else {
                    // Handle non-point features
                    const layerType = feature.geometry.type === 'LineString' ? 'line' : 'fill';
                    map.addLayer({
                        id: `geojson-layer-${index}`,
                        type: layerType,
                        source: 'geojson-source',
                        filter: ['==', ['id'], feature.id],
                        paint: {
                            // Set paint properties based on feature's geometry type
                            'fill-color': feature.properties.fill || '#888888',
                            'fill-opacity': feature.properties['fill-opacity'] || 0.5,
                            'line-color': feature.properties.stroke || '#888888',
                            'line-width': feature.properties['stroke-width'] || 2
                        }
                    });
                }
            });
        });

        return () => map.remove(); // Clean up the map instance
    });

    return (
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
    );
};

export default MapboxComponent;
