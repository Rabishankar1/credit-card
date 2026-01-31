"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IconHomeFilled } from "@tabler/icons-react";

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
          justifyContent: "flex-start",
          gap: 4,
          padding: 16,
          backgroundColor: "#80808030",
        }}
      >
        {/* <Button onClick={() => router.push("/approvals/login")}>
          Approval login
        </Button> */}
        <IconHomeFilled onClick={() => router.push("/")} size={30} />
      </div>
      {children}
    </section>
  );
}
