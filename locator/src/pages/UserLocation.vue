<template>
  <div class="locator-container">
    <h1 class="ui header">Locator</h1>

    <div class="ui center aligned action input">
      <input type="text" v-model="searchQuery" placeholder="Enter location" @keydown.enter="searchByEnter"/>
      <button class="ui green button" @click="searchLocation">Search</button>
      <button class="ui button" @click="getCurrentLocation">Get Current Location</button>
    </div>

    <section id="map" class="ui segment"></section>

    <table v-show="searchResults.length > 0" class="ui table fixed bottom attached">
      <thead>
        <tr>
          <th>Index</th>
          <th>Location Name</th>
          <th>Time Zone</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in paginatedResults" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ result.name }}</td>
          <td>{{ result.timezone }}</td>
          <td><input type="checkbox" @click="deleteResult(index)" /></td>
        </tr>
      </tbody>
    </table>

    <div v-show="searchResults.length > 0" class="ui pagination">
      <button class="ui button" @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }}</span>
      <button class="ui button" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Locator',
  data() {
    return {
      map: null,
      searchQuery: '',
      searchResults: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  mounted() {
    onMounted(this.loadMap);
  },
  methods: {
    loadMap() {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.651070, lng: -79.347015 },
        zoom: 15,
      });
      this.map.setMap(this.map);
    },
    searchLocation() {
      if (this.searchQuery) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.searchQuery }, (results, status) => {
          if (status === 'OK') {
            const result = {
              name: results[0].formatted_address,
              location: results[0].geometry.location,
              timezone: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
            };
            this.searchResults.push(result);
            this.showMarker(result);
          }
        });
      }
    },
    showMarker(result) {
      new google.maps.Marker({
        position: result.location,
        map: this.map,
      });
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (results, status) => {
              if (status === 'OK') {
                const result = {
                  name: results[0].formatted_address,
                  location: latLng,
                  timezone: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
                };
                this.searchResults.push(result);
                this.showMarker(result);
              }
            });
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    deleteResult(index) {
      this.searchResults.splice(index, 1);
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    searchByEnter(){
      this.searchLocation();
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.searchResults.length / this.pageSize);
    },
    paginatedResults() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.searchResults.slice(startIndex, endIndex);
    },
  },
};
</script>

<style>
.locator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.ui.segment {
  height: 400px;
  margin-bottom: 10px;
}

.ui.table th,
.ui.table td {
  padding: 5px;
}

.ui.pagination {
  margin-top: 10px;
}
</style>