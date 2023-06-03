
<template>
  <div class="locator-container">
    <h1 class="ui header">Locator</h1>

    <div class="ui center aligned action input">
      <input type="text" v-model="searchQuery" placeholder="Enter location" @keydown.enter="searchByEnter"/>
      <button class="ui green button" @click="searchLocation">Search</button>
      <button class="ui button" @click="getCurrentLocation">Get Current Location</button>
    </div>

    <div id="map" class="ui segment"></div>

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

export default {
  name: 'Locator',
  data() {
    return {
      map: null, //Google Map Object
      searchQuery: '', //User Input Location
      searchResults: [], //Array to store the results
      markers:[], //Array to store the markers
      currentPage: 1, //Current Page for table
      pageSize: 10, //Number of rows per page in the table
    };
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      //Load map based on Toronto location
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.651070, lng: -79.347015 },
        zoom: 15,
      });
    },
    searchLocation() {
      if (this.searchQuery) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.searchQuery }, (results, status) => {
          if (status === 'OK') {
            const result = {
              name: results[0].formatted_address, // Get formatted address
              location: results[0].geometry.location, //Get the location coordinates
              timezone: new Date().toLocaleString('en-US', { timeZoneName: 'short' }), //Get the timezone
            };
            this.searchResults.push(result); // Add the result to the array
            this.showMarker(result); // Display the marker
          }
        });
      }
    },
    showMarker(result) {
      const marker = new google.maps.Marker({
        position: result.location,
        map: this.map,
      });
      this.markers.push(marker); //Add the marker to the array
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => { // Get current Laitude and longitude
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
      const marker = this.markers[index];
      marker.setMap(null); 

      this.markers.splice(index, 1); // Remove markers from array
      this.searchResults.splice(index, 1); // Remove from table
      // Update Current pages
      if (this.currentPage > this.totalPages) {
        this.currentPage--;
      }
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
    searchByEnter(){ // Use keyboard enter to search
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
#map {
  height: 100%;
  width:100%;
}
</style>