import {
  fetchDogBreeds,
  fetchCatBreeds,
  fetchDogImages,
  fetchCatImages,
} from "@/services/animals";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BreedDetail() {
  const router = useRouter();
  const { type, id } = router.query;

  const [breed, setBreed] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!type || !id) return;

    const loadData = async () => {
      let breeds =
        type === "dog" ? await fetchDogBreeds() : await fetchCatBreeds();
      const breed = breeds.find((b: any) => b.id.toString() === id);
      setBreed(breed);

      const images =
        type === "dog"
          ? await fetchDogImages(breed.id)
          : await fetchCatImages(breed.id);
      setImages(images.map((img: any) => img.url));
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
          <img key={i} src={img} alt={breed.name} className="rounded" />
        ))}
      </div>
    </div>
  );
}
