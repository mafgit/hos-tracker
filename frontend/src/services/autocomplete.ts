export async function fetchSuggestions(query: string) {
  // const res = await fetch(`https://photon.komoot.io/api/?q=${query}`);
  // const data = await res.json();
  // data.features.map(f => )

  return [
    { lat: 0, lng: 0, text: "Location 1" },
    { lat: 1, lng: 1, text: "Location 2" },
    { lat: 2, lng: 2, text: "Location 3" },
  ];
}
