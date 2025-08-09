"use client";

import { BreedCard } from "@/components/BreedCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { fetchCatBreeds, fetchDogBreeds } from "@/services/animals";
import { useEffect, useState } from "react";

export default function Home() {
  //eslint-disable-next-line
  const [breeds, setBreeds] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadBreeds = async () => {
      const [cats, dogs] = await Promise.all([
        fetchCatBreeds(),
        fetchDogBreeds(),
      ]);

      // Fetch missing images for cats
      const catBreedsWithImages = await Promise.all(
        //eslint-disable-next-line
        cats.map(async (c: any) => {
          let imageUrl = c.image?.url;
          if (!imageUrl) {
            const imgRes = await fetch(
              `https://api.thecatapi.com/v1/images/search?breed_id=${c.id}&limit=1`
            );
            const imgData = await imgRes.json();
            imageUrl = imgData[0]?.url || "/placeholder.png";
          }
          return { id: c.id, name: c.name, image: imageUrl, type: "cat" };
        })
      );

      // Fetch missing images for dogs
      const dogBreedsWithImages = await Promise.all(
        //eslint-disable-next-line
        dogs.map(async (d: any) => {
          let imageUrl = d.image?.url;
          if (!imageUrl) {
            const imgRes = await fetch(
              `https://api.thedogapi.com/v1/images/search?breed_id=${d.id}&limit=1`
            );
            const imgData = await imgRes.json();
            imageUrl = imgData[0]?.url || "/placeholder.png";
          }
          return { id: d.id, name: d.name, image: imageUrl, type: "dog" };
        })
      );

      setBreeds([...catBreedsWithImages, ...dogBreedsWithImages]);
    };

    loadBreeds();
  }, []);

  const filteredBreeds = breeds.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        🐾 Pet Breed Explorer
      </h1>
      <SearchBar onSearch={setSearchTerm} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBreeds.map((breed) => (
          <BreedCard key={`${breed.type}-${breed.id}`} {...breed} />
        ))}
      </div>
    </main>
  );
}
