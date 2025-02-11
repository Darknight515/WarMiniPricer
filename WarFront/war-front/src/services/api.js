const API_KEY = "";
const BASE_URL = "http://127.0.0.1:8000/";

// Get list of all minis
export const getMiniDataList = async () => {
    try {
      const response = await fetch(`${BASE_URL}mini-data-list/`);
      return response.json();
    } catch (error) {
      console.error("Error fetching mini data list:", error);
      throw error;
    }
  };
  
  // Trigger spider to read and insert spider data
  export const readSpiderData = async () => {
    try {
      const response = await fetch(`${BASE_URL}read-spider-data/`);
      return response.json();
    } catch (error) {
      console.error("Error reading spider data:", error);
      throw error;
    }
  };
  
  // Get detail data for a single mini
  export const getMiniDetail = async (miniId) => {
    try {
      const response = await fetch(`${BASE_URL}mini/${miniId}/detail/`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching details for mini ${miniId}:`, error);
      throw error;
    }
  };
  
  // Get price history for a single mini with optional pagination
  export const getMiniPriceHistory = async (miniId, page = 1, pageSize = 10) => {
    try {
      const response = await fetch(
        `${BASE_URL}mini/${miniId}/price-history/?page=${page}&page_size=${pageSize}`
      );
      return response.json();
    } catch (error) {
      console.error(`Error fetching price history for mini ${miniId}:`, error);
      throw error;
    }
  };
  
  // Get price history for multiple minis via a comma separated list of IDs
  export const getMultipleMiniPriceHistory = async (miniIds, page = 1, pageSize = 10) => {
    // miniIds should be an array, we join it into a comma-separated string.
    const miniIdsParam = miniIds.join(',');
    try {
      const response = await fetch(
        `${BASE_URL}mini/multiple-price-history/?mini_ids=${miniIdsParam}&page=${page}&page_size=${pageSize}`
      );
      return response.json();
    } catch (error) {
      console.error("Error fetching multiple minis price history:", error);
      throw error;
    }
  };
  
  // Get the MSRP for a single mini
  export const getMiniMsrp = async (miniId) => {
    try {
      const response = await fetch(`${BASE_URL}mini/${miniId}/msrp/`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching MSRP for mini ${miniId}:`, error);
      throw error;
    }
  };
  
  // Get MSRP for multiple minis via a comma separated list of IDs
  export const getMultipleMsrp = async (miniIds) => {
    const miniIdsParam = miniIds.join(',');
    try {
      const response = await fetch(`${BASE_URL}mini/multiple-msrp/?mini_ids=${miniIdsParam}`);
      return response.json();
    } catch (error) {
      console.error("Error fetching multiple minis MSRP:", error);
      throw error;
    }
  };

  // Get minis with recent (60 days) changes
  export const getRecentPriceChanges = async () => {
    try {
      const response = await fetch(`${BASE_URL}recent-price-changes/`);
      return response.json();
    } catch (error) {
      console.error("Error fetching recent price changes:", error)
      throw error;
    }
  }