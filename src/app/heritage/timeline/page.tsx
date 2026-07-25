import { Metadata } from "next";
import { FullTimelineView } from "@/components/sections/FullTimelineView";

export const metadata: Metadata = {
  title: "Timeline | Audemars Piguet",
  description: "Explore the history of Audemars Piguet through key milestones since 1875.",
};

export default function TimelinePage() {
  return (
    <div className="pt-24 pb-32 bg-black min-h-screen">
      <FullTimelineView />
    </div>
  );
}
