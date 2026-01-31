"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { applicationType } from "@/lib/types/application";
import { CreateApplicationResponse } from "@/lib/mock-application-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NewApplication = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [response, setResponse] =
    React.useState<CreateApplicationResponse | null>(null);
  const router = useRouter();

  const form = useForm<applicationType>({
    defaultValues: {
      name: "",
      email: "",
      phone: undefined,
      salary: undefined,
      pan: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (values: applicationType) => {
    if (
      !values.dateOfBirth ||
      values.phone === undefined ||
      values.salary === undefined
    ) {
      return;
    }

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_BASE_URL?.trim() || "";
      const apiUrl = apiBaseUrl
        ? `${apiBaseUrl}/api/users/application`
        : "/api/users/application";
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await apiResponse.json();
      setResponse(data);
      setDialogOpen(true);
      form.reset();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleSendApplication = () => {
    setDialogOpen(false);
    if (response?.applicationId) {
      router.push(`/application/${response.applicationId}`);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          New Application
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details and submit the application to see the mock API
          response.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: "Phone number is required",
                validate: (value) =>
                  typeof value === "number" && !Number.isNaN(value)
                    ? true
                    : "Phone number is required",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="9876543210"
                      value={field.value ?? ""}
                      onChange={(event) => {
                        const raw = event.target.value;
                        const parsed = raw === "" ? undefined : Number(raw);
                        field.onChange(
                          Number.isNaN(parsed) ? undefined : parsed,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary"
              rules={{
                required: "Salary is required",
                validate: (value) =>
                  typeof value === "number" && !Number.isNaN(value)
                    ? true
                    : "Salary is required",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="550000"
                      value={field.value ?? ""}
                      onChange={(event) => {
                        const raw = event.target.value;
                        const parsed = raw === "" ? undefined : Number(raw);
                        field.onChange(
                          Number.isNaN(parsed) ? undefined : parsed,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pan"
              rules={{ required: "PAN is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCDE1234F"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              rules={{ required: "Date of birth is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {/* <DialogHeader>
            <DialogTitle>Application Submitted</DialogTitle>
            <DialogDescription>
              Mock API response returned with the submitted details.
            </DialogDescription>
          </DialogHeader> */}

          {response ? (
            response.status === "rejected" ? (
              <div className="flex flex-col gap-2">
                <div>Sorry, this product cannot be processed at this time.</div>
                <div className="text-sm text-muted-foreground">
                  Application ID: {response.applicationId}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div>Your approved limit is: INR {response.limit}</div>
                <div className="text-sm text-muted-foreground">
                  Application ID: {response.applicationId}
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Waiting for the API response...
            </p>
          )}

          {/* <div className="grid gap-2">
            <Label htmlFor="review-note">Additional Input</Label>
            <Input
              id="review-note"
              placeholder="Add a note or reference"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div> */}

          <DialogFooter>
            <Button
              type="button"
              onClick={handleSendApplication}
              disabled={!response}
            >
              {response ? "Redirect to application" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewApplication;
