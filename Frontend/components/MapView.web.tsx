import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapView({ style, initialRegion, ...props }) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          #map { height: 100%; width: 100%; }
          html, body { height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView(
            [${initialRegion?.latitude || 23.8103}, ${initialRegion?.longitude || 90.4125}],
            ${initialRegion?.latitudeDelta ? Math.log2(360 / initialRegion.latitudeDelta) : 13}
          );
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      style={[styles.map, style]}
      source={{ html: htmlContent }}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  }
});