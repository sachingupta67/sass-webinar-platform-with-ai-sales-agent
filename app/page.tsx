import { Waitlist } from "@clerk/nextjs";
import Link from "next/link";

export default function WaitlistPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Link href="/sign-in">Login</Link>
      <Waitlist />
    </div>
  );
}
