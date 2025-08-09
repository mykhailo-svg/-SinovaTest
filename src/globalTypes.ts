export type Breed = {
  id: string | number;
  name: string;
  description?: string;
  image?: { url: string };
};

export type FormattedBreed = Omit<Breed, "image"> & {
  type: BREED_TYPE;
  image: string | undefined;
};

export enum BREED_TYPE {
  CAT = "cat",
  DOG = "dog",
}
