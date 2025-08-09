import { BREED_TYPE } from "@/globalTypes";

const BASE_URLS: Record<BREED_TYPE, string> = {
  [BREED_TYPE.CAT]: "https://api.thecatapi.com/v1",
  [BREED_TYPE.DOG]: "https://api.thedogapi.com/v1",
};

export const getApiBaseUrlByBreedType = (type: BREED_TYPE) => {
  const baseUrl = BASE_URLS[type];

  if (!baseUrl) {
    throw new Error("Provide valid breed type");
  }

  return baseUrl;
};
