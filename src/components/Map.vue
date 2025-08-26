<template>
  <div
    ref="mapElement"
    data-testid="map-element"
    style="height: 600px; width: 100%"
  ></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

const props = defineProps({
  coordinates: {
    type: Array,
    default: () => [],
  },
  userLocation: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['marker-click'])

const mapElement = ref(null)
const map = ref(null)
const markersLayer = ref(null)
const userMarker = ref(null)
const userCircle = ref(null)

onMounted(() => {
  if (!mapElement.value) {
    return
  }

  map.value = L.map(mapElement.value).setView([48.8566, 2.3522], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value)

  markersLayer.value = L.layerGroup().addTo(map.value)

  updateMarkers(props.coordinates)
  updateUserLocation(props.userLocation)
})

watch(
  () => props.coordinates,
  newCoords => {
    updateMarkers(newCoords)
  },
  { deep: true }
)

watch(
  () => props.userLocation,
  newLocation => {
    updateUserLocation(newLocation)
  },
  { deep: true }
)

function updateMarkers(coords) {
  if (!markersLayer.value) {
    return
  }

  markersLayer.value.clearLayers()

  coords.forEach(point => {
    const marker = L.marker([point.lat, point.lng])
    marker.bindPopup(point.name || 'Sans nom')
    marker.on('click', () => emit('marker-click', point))
    markersLayer.value.addLayer(marker)
  })

  if (coords.length && map.value) {
    const group = L.featureGroup(coords.map(p => L.marker([p.lat, p.lng])))
    map.value.fitBounds(group.getBounds().pad(0.5))
  }
}

function updateUserLocation(location) {
  if (!map.value) return

  if (userMarker.value) {
    map.value.removeLayer(userMarker.value)
    userMarker.value = null
  }
  if (userCircle.value) {
    map.value.removeLayer(userCircle.value)
    userCircle.value = null
  }

  if (location && location.latitude && location.longitude) {
    const latlng = [location.latitude, location.longitude]

    userMarker.value = L.marker(latlng, {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
        iconSize: [25, 25],
      }),
    }).addTo(map.value)

    userCircle.value = L.circle(latlng, {
      radius: location.radius * 1000,
      color: '#61C187',
      fillColor: '#61C187',
      fillOpacity: 0.2,
    }).addTo(map.value)
  }
}
</script>

<style lang="scss" scoped>
.map-class {
  height: 800px;
  width: 1100px;
}

@media (max-width: 600px) {
  .map-class {
    height: 500px;
    width: 100%;
  }
}
</style>
