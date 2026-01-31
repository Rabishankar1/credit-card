"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { redirect, RedirectType } from "next/navigation";
import { Card } from "@/components/ui/card";

const Login = () => {
  const [id, setId] = useState("");
  return (
    <div className="w-full h-full min-h-screen flex justify-center align-center">
      <Card className="flex p-6 justify-between w-[50%] h-[50vh] max-h-50 mt-16">
        Application id:{" "}
        <Input value={id} onChange={(e) => setId(e.target.value)} />
        <Button
          onClick={() => {
            redirect(`/application/${id}`, RedirectType.push);
          }}
        >
          Login
        </Button>
      </Card>
    </div>
  );
};

export default Login;
