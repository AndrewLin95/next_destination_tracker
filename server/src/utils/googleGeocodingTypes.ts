export interface GoogleGeocodeResponse { 
  results: GoogleGeocodeResults[],
  status: string,
}

interface GoogleGeocodeResults {
  address_components: GoogleGeocodeAddressComponents[],
  formatted_address: string,
  geometry: GoogleGeocodeGeometry,
  place_id: string,
  types: string[],
}

interface GoogleGeocodeAddressComponents {
  long_name: string,
  short_name: string,
  types: string[]
}

interface GoogleGeocodeGeometry {
  bounds: {
    northeast: {
      lat: number,
      lng: number
    },
    southwest: {
      lat: number,
      lng: number,
    }
  },
  location: {
    lat: number,
    lng: number,
  }
  location_type: string,
  viewport: {
    northeast: {
      lat: number,
      lng: number
    },
    southwest: {
      lat: number,
      lng: number,
    }
  }
}