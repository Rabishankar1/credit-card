"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ApprovalsLayout({
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
        <Button onClick={() => router.push("/application/new")}>
          New Application
        </Button>
        <Button onClick={() => router.push("/application/login")}>
          Customer Login
        </Button>
      </div>
      {children}
    </section>
  );
}
