"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type FormValues = {
  name: string;
  email: string;
  phone: number | undefined;
  salary: number | undefined;
  pan: string;
  dateOfBirth: string;
};

type ApiPayload = {
  name: string;
  email: string;
  phone: number;
  salary: number;
  pan: string;
  dateOfBirth: Date;
};

type CheckEligibilityApiResponse = {
  status: "allowed" | "rejected";
  limit: number;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockPostApplication = async (
  payload: ApiPayload,
): Promise<CheckEligibilityApiResponse> => {
  await wait(650);

  return {
    status: "allowed",
    limit: 75000,
  };
};

const NewApplication = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [response, setResponse] = useState<CheckEligibilityApiResponse | null>(
    null,
  );

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: undefined,
      salary: undefined,
      pan: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const phone = values.phone ?? Number.NaN;
    const salary = values.salary ?? Number.NaN;

    if (!values.dateOfBirth || Number.isNaN(phone) || Number.isNaN(salary)) {
      return;
    }

    const payload: ApiPayload = {
      name: values.name,
      email: values.email,
      phone,
      salary,
      pan: values.pan,
      dateOfBirth: new Date(values.dateOfBirth),
    };

    const apiResponse = await mockPostApplication(payload);
    setResponse(apiResponse);
    setDialogOpen(true);
    form.reset();
  };

  const handleSendApplication = async () => {
    setDialogOpen(false);
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
              <div>Sorry, This product can not be processed at this time.</div>
            ) : (
              <div className="flex flex-col gap-2">
                Your approved limit is: {response.limit}{" "}
                {response?.limit ||
                  (0 > 500000 && (
                    <div>{`( Credit Limit is greater than 1000000 )`}</div>
                  ))}
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
            <Button type="button" onClick={handleSendApplication}>
              Send Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewApplication;
