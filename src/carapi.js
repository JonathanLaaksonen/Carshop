const apiUrl = import.meta.env.VITE_API_URL;


export const fetchCars = () => {
    return fetch(apiUrl)
    .then(response => {
      if (!response.ok)
        throw new Error("Error in fetch: " + response.statusText);
    
      return response.json();
    })
  }
  
  