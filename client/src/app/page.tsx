"use client"

import { BreedCard } from "@/components/BreedCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { fetchCatBreeds, fetchDogBreeds } from "@/services/animals";
import { useEffect, useState } from "react";

export default function Home() {
  const [breeds, setBreeds] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadBreeds = async () => {
      const [cats, dogs] = await Promise.all([
        fetchCatBreeds(),
        fetchDogBreeds(),
      ]);

      const formattedCats = cats.map((c: any) => ({
        id: c.id,
        name: c.name,
        image: c.image?.url || "/placeholder.png",
        type: "cat",
      }));

      const formattedDogs = dogs.map((d: any) => ({
        id: d.id,
        name: d.name,
        image: d.image?.url || "/placeholder.png",
        type: "dog",
      }));

      console.log(cats);
      console.log(dogs);
      

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
