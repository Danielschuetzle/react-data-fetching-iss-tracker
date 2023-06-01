// Import necessary dependencies
import useSWR from "swr";
import Controls from "../Controls/index";
import Map from "../Map/index";

// Define the API endpoint
const URL = "https://api.wheretheiss.at/v1/satellites/25544";

// Define the fetcher function to use with SWR
// It will handle the actual data fetching
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.status = response.status;
    throw error;
  }
  return response.json();
};

// Define the main component
export default function ISSTracker() {
  // Use the SWR hook to fetch data from the API
  // This will return the fetched data, any error that occurred, and a mutate function
  // We set the refreshInterval to 5000ms (5 seconds)
  const { data, error, mutate } = useSWR(URL, fetcher, { refreshInterval: 5000 });

  // If there was an error fetching the data, we display an error message
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // If the data is still loading (i.e., undefined), we display a loading message
  if (!data) {
    return <div>Loading...</div>;
  }

  // Once the data is available, we render the Map and Controls components
  // We pass the fetched longitude and latitude as props to both components
  // We pass the mutate function (which refetches the data) as the onRefresh prop to the Controls component
  return (
    <main>
      <Map longitude={data.longitude} latitude={data.latitude} />
      <Controls
        longitude={data.longitude}
        latitude={data.latitude}
        onRefresh={() => mutate()}  // refetch data when Refresh button is clicked
      />
    </main>
  );
}
