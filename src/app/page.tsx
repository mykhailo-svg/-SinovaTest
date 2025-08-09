"use client";

import { chunk } from "lodash-es";
import { BreedCard } from "@/components/BreedCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { Breed, BREED_TYPE, FormattedBreed } from "@/globalTypes";
import { fetchBreedsByType } from "@/services/animals";
import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrlByBreedType } from "@/services/api";

type BreedsState = {
  items: FormattedBreed[];
  isLoading: boolean;
};

export default function Home() {
  const [breeds, setBreeds] = useState<BreedsState>({
    items: [],
    isLoading: true,
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadBreeds = async () => {
      let breedsItems: BreedsState["items"] = [];

      const breedsToFetch = Object.values(BREED_TYPE) as BREED_TYPE[];

      const breedsGroups = await Promise.all(
        breedsToFetch.map((type) => {
          return (async () => {
            const breeds = await fetchBreedsByType(type);

            return {
              items: breeds,
              type,
            };
          })();
        })
      );

      for (const breedsGroup of breedsGroups) {
        const formattedBreedsGroup = await formatBreeds(
          breedsGroup.items,
          breedsGroup.type
        );

        breedsItems = [...breedsItems, ...formattedBreedsGroup];
      }

      setBreeds({ items: breedsItems, isLoading: false });
    };

    loadBreeds();
  }, []);

  const filteredBreeds = breeds.items.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const autocompleteNames = useMemo(() => {
    return breeds.items.map((breed) => breed.name);
  }, [breeds]);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        🐾 Pet Breed Explorer
      </h1>

      <SearchBar names={autocompleteNames} onSearch={setSearchTerm} />

      {breeds.isLoading && "Loading..."}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBreeds.length || breeds.isLoading
          ? filteredBreeds.map((breed) => (
              <BreedCard key={`${breed.type}-${breed.id}`} {...breed} />
            ))
          : "No breeds found..."}
      </div>
    </main>
  );
}

async function formatBreeds(breeds: Breed[], type: FormattedBreed["type"]) {
  const chunkedBreeds = chunk(breeds, 20);

  let formattedBreeds: FormattedBreed[] = [];

  for (const chunk of chunkedBreeds) {
    const formattedChunk = await Promise.all(
      chunk.map(async (c) => {
        let imageUrl = c.image?.url;
        if (!imageUrl) {
          try {
            const imgData = await fetchWithRetry(
              `${getApiBaseUrlByBreedType(type)}/images/search?breed_id=${
                c.id
              }&limit=1`
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
