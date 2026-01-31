import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { redirect, RedirectType } from "next/navigation";

const page = () => {
  const [id, setId] = useState("");
  return (
    <div>
      Application id:{" "}
      <Input value={id} onChange={(e) => setId(e.target.value)} />
      <Button
        onClick={() => {
          redirect(`/application/${id}`, RedirectType.push);
        }}
      >
        Login
      </Button>
    </div>
  );
};

export default page;
