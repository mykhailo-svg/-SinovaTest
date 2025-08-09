export type Breed = {
  id: string | number;
  name: string;
  description?: string;
  image?: { url: string };
};

export type FormattedBreed = Breed & {
  type: "cat" | "dog";
  image: string;
};
