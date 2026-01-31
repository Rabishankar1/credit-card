"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IconHomeFilled } from "@tabler/icons-react";

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
          justifyContent: "flex-start",
          gap: 4,
          padding: 16,
          backgroundColor: "#80808030",
        }}
      >
        <IconHomeFilled
          onClick={() => router.push("/")}
          size={30}
          className="cursor-pointer"
        />
      </div>

      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
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
        <IconHomeFilled onClick={() => router.push("/")}/>
      </div> */}
      {children}
    </section>
  );
}
