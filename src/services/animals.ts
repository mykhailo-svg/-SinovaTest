export const fetchDogBreeds = async () => {
  const res = await fetch("https://api.thedogapi.com/v1/breeds");
  return res.json();
};

export const fetchCatBreeds = async () => {
  const res = await fetch("https://api.thecatapi.com/v1/breeds");
  return res.json();
};

export const fetchDogImages = async (breedId: number) => {
  const res = await fetch(
    `https://api.thedogapi.com/v1/images/search?breed_id=${breedId}&limit=8`
  );
  return res.json();
};

export const fetchCatImages = async (breedId: string) => {
  const res = await fetch(
    `https://api.thecatapi.com/v1/images/search?breed_id=${breedId}&limit=8`
  );
  return res.json();
};
