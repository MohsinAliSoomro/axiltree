export const fetchLocation = async () => {
  const res = await fetch(
    "https://api.ipregistry.co/?key=" + process.env.NEXT_PUBLIC_LOCATION_KEY
  );
  return await res.json();
};
