"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter } from "./Filter";
import { isAddress, isHex } from "viem";
import { hardhat } from "viem/chains";
import { usePublicClient } from "wagmi";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const client = usePublicClient({ chainId: hardhat.id });

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isHex(searchInput)) {
      try {
        const tx = await client?.getTransaction({ hash: searchInput });
        if (tx) {
          router.push(`/blockexplorer/transaction/${searchInput}`);
          return;
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
      }
    }

    if (isAddress(searchInput)) {
      router.push(`/blockexplorer/address/${searchInput}`);
      return;
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full flex items-center justify-start mb-5 mx-5">
      <input
        className="border-primary bg-base-100 text-base-content p-2 mr-2 sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
        type="text"
        value={searchInput}
        placeholder="Search asset by name"
        onChange={e => setSearchInput(e.target.value)}
      />
      <button className="h-10 btn btn-sm btn-primary" type="submit">
        <MagnifyingGlassIcon className="mt-5 h-[22px] w-[22px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </button>
      <div className="pl-5"></div>

      <Filter />
    </form>
  );
};
