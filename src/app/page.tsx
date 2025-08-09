"use client";

import { chunk } from "lodash-es";
import { BreedCard } from "@/components/BreedCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { Breed, FormattedBreed } from "@/globalTypes";
import { fetchCatBreeds, fetchDogBreeds } from "@/services/animals";
import { useEffect, useState } from "react";

export default function Home() {
  const [breeds, setBreeds] = useState<FormattedBreed[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadBreeds = async () => {
      const [cats, dogs] = await Promise.all([
        fetchCatBreeds(),
        fetchDogBreeds(),
      ]);

      const formattedCats = await formatBreeds(cats, "cat");
      const formattedDogs = await formatBreeds(dogs, "dog");

      setBreeds([...formattedCats, ...formattedDogs]);
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

async function formatBreeds(breeds: Breed[], type: FormattedBreed["type"]) {
  const chunkedBreeds = chunk(breeds, 10);

  let formattedBreeds: FormattedBreed[] = [];

  for (const chunk of chunkedBreeds) {
    const formattedChunk = await Promise.all(
      chunk.map(async (c) => {
        let imageUrl = c.image?.url;
        if (!imageUrl) {
          try {
            const imgData = await fetchWithRetry(
              `https://api.the${type}api.com/v1/images/search?breed_id=${c.id}&limit=1`
            );
            imageUrl = imgData[0]?.url || "/placeholder.png";
          } catch (error) {
            // fallback on error
            imageUrl = "/placeholder.png";
          }
        }
        return { id: c.id, name: c.name, image: imageUrl, type };
      })
    );

    formattedBreeds = [
      ...formattedBreeds,
      ...(formattedChunk as FormattedBreed[]),
    ];
  }

  return formattedBreeds;
}

async function fetchWithRetry(
  url: string,
  options = {},
  retries = 3,
  delay = 500
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}
