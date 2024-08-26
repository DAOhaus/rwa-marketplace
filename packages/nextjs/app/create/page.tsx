import React from "react";
import ListingForm from "./_components/ListingForm";
import { promises as fs } from "fs";

export default async function page(): Promise<any> {
  const file = await fs.readFile(process.cwd() + "/app/create/_components/asset_attributes.json", "utf8");
  const data: any = await JSON.parse(file);

  return (
    <div>
      <ListingForm jsonData={data} />
    </div>
  );
}
