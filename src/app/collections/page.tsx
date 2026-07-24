import { Metadata } from "next";
import { CollectionShowcase } from "@/components/sections/CollectionShowcase";

export const metadata: Metadata = {
  title: "Collections | Audemars Piguet",
  description: "Discover our collections — Royal Oak, Royal Oak Offshore, and Code 11.59.",
};

export default function CollectionsPage() {
  return <CollectionShowcase />;
}
