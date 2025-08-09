import { Breed, BREED_TYPE } from "@/globalTypes";
import { getApiBaseUrlByBreedType } from "./api";

export const fetchBreedsByType = async (type: BREED_TYPE) => {
  const res = await fetch(getApiBaseUrlByBreedType(type) + "/breeds?limit=20");

  return res.json();
};

export const fetchBreedImages = async (
  type: BREED_TYPE,
  breedId: string | number
) => {
  const res = await fetch(
    getApiBaseUrlByBreedType(type) +
      `/images/search?breed_id=${breedId}&limit=8`
  );

  return res.json() as Promise<NonNullable<Breed["image"]>[]>;
};
