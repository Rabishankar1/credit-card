"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 4,
          padding: 16,
        }}
      >
        <Button onClick={() => router.push("/approvals/login")}>
          Approval login
        </Button>
      </div>
      {children}
    </section>
  );
}
