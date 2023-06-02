<!-- <template>
    <div>
        <h1 class="ui centered">Locator</h1>
    <section class="ui two column centered grid" style="position:relative;z-index:1">
        <div class="column">
            <form class="ui segment large form">
                <div class="ui message red" v-show="error">{{ error }}</div>
                <div class="ui segment">
                    <div class="field">
                        <div class="ui right icon input large" :class="{loading:spinner}">
                            <input type="text" placeholder="Enter your address" v-model="address" id="autocomplete"/>
                            <i class="circle icon link icon" @click="LocatorButton"></i>
                        </div>
                    </div>
                    <button class="ui button">Go</button>
                </div>
            </form>
        </div>

    </section>

    <section id="map">

    </section>
    </div>
    
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            address:"",
            error:"",
            spinner:false
        }
    },

    mounted() {
        let autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            {
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(43.651070, -79.347015)
                )
            }
        );
        autocomplete.addListener("place_changed", ()=>{
            let place = autocomplete.getPlace();
            console.log(place);
            this.UserLocationOnMap(place.geometry.location.lat(),place.geometry.location.lng())
        })
        
    },

    methods:{
        LocatorButton(){
            this.spinner = true;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position=>{
                    this.getAddressFrom(position.coords.latitude,position.coords.longitude);
                    
                    //console.log(position.coords.latitude);
                    //console.log(position.coords.longitude);

                    this.UserLocationOnMap(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                },
                error => {
                    this.error = error.message;
                    //console.log(error.message);
                    this.spinner = false;
                }
                );
            } else{
                this.error = error.message;
                this.spinner = false;

                //console.log("Your browswer does not support this API")
            }
        },
        getAddressFrom(lat,long) {
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" 
            + lat + 
            "," 
            + long 
            + "&key=AIzaSyBt3Pnau356No6HqdsvKNH8deAav5dvJtI")
            .then(response => {
                if(response.data.error_message){
                    this.error = response.data.error_message;
                    //console.log(response.data.error_message);
                } else{
                    this.address=response.data.results[0].formatted_address
                    //console.log(response.data.results[0].formatted_address);
                }
                this.spinner = false;

            })
            .catch(error => {
                this.error = error.message;
                this.spinner = false;

                //console.log(error.message)
            })
        },
        UserLocationOnMap(latitude,longitude){
            let map = new google.maps.Map(document.getElementById("map"),{
                zoom:15,
                center:new google.maps.LatLng(latitude,longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map:map
            });
        }

    }
}
</script>

<style>
.ui.button,
.dot.circle.icon
{
    background-color: blue
}

.pac-icon{
    display: none;
}

.pac-item{
    padding:10px;
    font-size:16px;
    cursor:pointer;
}

.pac-item:hover{
    background-color:aliceblue;
}

.pac-item-query{
    font-size:16px
}

#map{
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background-color: red;
}
</style> -->

<template>
    <div>
      <h1>Locator</h1>
  
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Enter location" />
        <button @click="searchLocation">Search</button>
        <button @click="getCurrentLocation">Get Current Location</button>
      </div>
  
      <div id="map"></div>
  
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Location Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in searchResults" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ result.name }}</td>
            <td><input type="checkbox" @click="deleteResult(index)" /></td>
          </tr>
        </tbody>
      </table>
  
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <span>{{ currentPage }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
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
      },
      searchLocation() {
        if (this.searchQuery) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: this.searchQuery }, (results, status) => {
            if (status === 'OK') {
              const result = {
                name: results[0].formatted_address,
                location: results[0].geometry.location,
                timeZone: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
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
                    timeZone: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
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
  .search-container {
    margin-bottom: 10px;
  }
  
  #map {
    height: 400px;
    margin-bottom: 10px;
  }
  
  table {
    width: 100%;
  }
  
  table th,
  table td {
    padding: 5px;
    border: 1px solid #ccc;
  }
  
  .pagination {
    margin-top: 10px;
  }
  
  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  