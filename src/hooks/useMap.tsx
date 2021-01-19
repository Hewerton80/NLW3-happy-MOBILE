import React, { useCallback, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import mapIcon from '../assets/images/map-marker.png';
import { useHistory } from 'react-router-dom';
mapboxgl.accessToken = String(process.env.REACT_APP_MAPBOX_TOKEN);
interface ILocal {
    latitude: number,
    longitude: number
}
//https://account.mapbox.com/
//https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
const useMap = (divRef: React.MutableRefObject<null>) => {
    //const divRef = useRef(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [, setLat] = useState<number>(0)
    const [, setLng] = useState<number>(0)
    const [, setZomm] = useState<number>(1)

    const history = useHistory();
    useEffect(() => {
        const mapbox = new mapboxgl.Map({
            container: divRef.current || '',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 0],
            zoom: 1
        })

        mapbox.on('move', () => {
            setLng(() => mapbox.getCenter().lng)
            setLat(() => mapbox.getCenter().lat)
            setZomm(() => mapbox.getZoom())
        })
        setMap(mapbox);
    }, [])

    const addDeDefaultMarker = useCallback(({ latitude, longitude }: ILocal) => {
        map && new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);
    }, [map])

    const addMarkers = useCallback((orphanages: any[]) => {
        map && map.loadImage(
            mapIcon, (error: any, image: any) => {
                if (error) throw error;
                map.addImage('orphanageIcon', image);
                map.addSource('orphanages', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: orphanages.map(({ latitude, longitude, name, id }) => ({
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [longitude, latitude],
                            },
                            id,
                            properties: {
                                description: `<span>${name}</span> `
                                // description: `<span>${name} <a href="http://localhost:3000/orphanage/${id}"> ➜ </a></span> `
                            }
                        }))
                    }
                });
                map.addLayer({
                    id: 'orphanages',
                    type: 'symbol',
                    source: 'orphanages',
                    layout: {
                        'icon-image': 'orphanageIcon',
                        'icon-size': 0.5,
                        'icon-allow-overlap': true,

                    }
                });
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    offset: [0, -20],
                });

                map.on('mouseenter', 'orphanages', function (e: any) {
                    // Change the cursor style as a UI indicator.
                    map.getCanvas().style.cursor = 'pointer';

                    var coordinates = e.features[0].geometry.coordinates.slice();
                    var description = e.features[0].properties.description;

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup.setLngLat(coordinates).setHTML(description).addTo(map);
                });

                map.on('mouseleave', 'orphanages', function () {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                });
                map.on('click', 'orphanages', function (e: any) {
                    const id = e.features[0].id;
                    //console.log(e.features[0].id)
                    history.push(`/orphanage/${id}`)
                });
            }
        );
    }, [map])

    const addMarkerOnclick = useCallback(({ latitude, longitude }: ILocal) => {
        if(map && map.hasImage('orphanageIcon')){
            map.removeLayer('orphanage')
            map.removeImage('orphanageIcon');
            map.removeSource('orphanage')
        }
        
        map && map.loadImage(
            mapIcon, (error: any, image: any) => {
                if (error) throw error;
                map.addImage('orphanageIcon', image);
                map.addSource('orphanage', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [{
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [longitude, latitude],
                            },
                            id: 'orphanage',
                            properties: {
                                description: ''
                            }
                        }]
                    }
                });
                map.addLayer({
                    id: 'orphanage',
                    type: 'symbol',
                    source: 'orphanage',
                    layout: {
                        'icon-image': 'orphanageIcon',
                        'icon-size': 0.5,
                        'icon-allow-overlap': true,

                    }
                });
            }
        );
    }, [map])




    return { map, addDeDefaultMarker, addMarkers, addMarkerOnclick }
}

export default useMap;