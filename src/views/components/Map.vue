<template>
  <div ref="mapElement" style="height: 600px; width: 100%"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  coordinates: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['marker-click'])

const mapElement = ref(null)
const map = ref(null)
const markersLayer = ref(null)

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
})

watch(
  () => props.coordinates,
  (newCoords) => {
    updateMarkers(newCoords)
  },
  { deep: true }
)

function updateMarkers(coords) {
  if (!markersLayer.value) {
    return
  }

  markersLayer.value.clearLayers()

  coords.forEach((point) => {
    const marker = L.marker([point.lat, point.lng])
    marker.bindPopup(point.label || 'Sans nom')
    marker.on('click', () => emit('marker-click', point))
    markersLayer.value.addLayer(marker)
  })

  if (coords.length && map.value) {
    const group = L.featureGroup(coords.map((p) => L.marker([p.lat, p.lng])))
    map.value.fitBounds(group.getBounds().pad(0.5))
  }
}
</script>
