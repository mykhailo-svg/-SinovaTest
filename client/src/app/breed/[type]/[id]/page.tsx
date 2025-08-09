"use client";

import {
  fetchDogBreeds,
  fetchCatBreeds,
  fetchDogImages,
  fetchCatImages,
} from "@/services/animals";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BreedDetail() {
  const { type, id } = useParams<{ type: string; id: string }>();

  //eslint-disable-next-line
  const [breed, setBreed] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!type || !id) return;

    const loadData = async () => {
      const breeds =
        type === "dog" ? await fetchDogBreeds() : await fetchCatBreeds();
        //eslint-disable-next-line
      const foundBreed = breeds.find((b: any) => b.id.toString() === id);
      setBreed(foundBreed);

      if (foundBreed) {
        const breedImages =
          type === "dog"
            ? await fetchDogImages(foundBreed.id)
            : await fetchCatImages(foundBreed.id);

            //eslint-disable-next-line
        setImages(breedImages.map((img: any) => img.url));
      }
    };

    loadData();
  }, [type, id]);

  if (!breed) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{breed.name}</h1>
      {breed.description && <p className="mb-4">{breed.description}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          //eslint-disable-next-line
          <img key={i} src={img} alt={breed.name} className="rounded" />
        ))}
      </div>
    </div>
  );
}
