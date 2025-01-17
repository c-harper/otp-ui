import Geocoder from "./abstract-geocoder";

/**
 * Geocoder implementation for the Pelias geocoder.
 * See https://pelias.io
 *
 * @extends Geocoder
 */
export default class PeliasGeocoder extends Geocoder {
  /**
   * Generate an autocomplete query specifically for the Pelias API. The
   * `sources` parameter is a Pelias-specific option.
   */
  getAutocompleteQuery(query) {
    const {
      apiKey,
      baseUrl,
      boundary,
      focusPoint,
      options,
      sources
    } = this.geocoderConfig;
    return {
      apiKey,
      boundary,
      focusPoint,
      options,
      // explicitly send over null for sources if provided sources is not truthy
      // in order to avoid default isomorphic-mapzen-search sources form being
      // applied
      sources: sources || null,
      url: baseUrl ? `${baseUrl}/autocomplete` : undefined,
      ...query
    };
  }

  /**
   * Generate a search query specifically for the Pelias API. The
   * `sources` parameter is a Pelias-specific option.
   */
  getSearchQuery(query) {
    const {
      apiKey,
      baseUrl,
      boundary,
      focusPoint,
      options,
      sources
    } = this.geocoderConfig;
    return {
      apiKey,
      boundary,
      focusPoint,
      options,
      // explicitly send over null for sources if provided sources is not truthy
      // in order to avoid default isomorphic-mapzen-search sources form being
      // applied
      sources: sources || null,
      url: baseUrl ? `${baseUrl}/search` : undefined,
      format: false, // keep as returned GeoJSON,
      ...query
    };
  }

  /**
   * Rewrite the response into an application-specific data format using the
   * first feature returned from the geocoder.
   */
  rewriteReverseResponse(response) {
    const { lat, lon } = response.isomorphicMapzenSearchQuery.point;

    const firstFeature = response[0];
    return {
      lat,
      lon,
      name: firstFeature.label,
      rawGeocodedFeature: firstFeature
    };
  }
}
