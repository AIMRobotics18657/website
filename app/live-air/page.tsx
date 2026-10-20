import type { Metadata } from "next";
import LiveAir from "./LiveAir";

export const metadata: Metadata = { title: "Live air" };

export default function LiveAirPage() {
  return <LiveAir />;
}
