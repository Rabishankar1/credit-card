"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  ApplicationRecord,
  getMockApplication,
} from "@/lib/mock-application-api";
import { useParams } from "next/navigation";

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || Number.isNaN(value)) {
    return "Not provided";
  }

  return `INR ${value.toLocaleString("en-IN")}`;
};

const formatPhone = (value: number | undefined) => {
  if (value === undefined || Number.isNaN(value)) {
    return "Not provided";
  }

  return value.toString();
};

const formatDate = (value: string) => {
  if (!value) {
    return "Not provided";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const getStatusVariant = (status: ApplicationRecord["status"]) => {
  if (status === "APPROVED") {
    return "default" as const;
  }

  if (status === "REJECTED") {
    return "destructive" as const;
  }

  return "secondary" as const;
};

export default function ApplicationViewPage() {
  //   {
  //   params,
  // }: {
  //   params: { id: string };
  // }
  const params = useParams();
  // console.log(params.id, "params",id);
  const applicationId = decodeURIComponent(
    (params as { id: string })?.id,
  ).trim();
  const [application, setApplication] = useState<ApplicationRecord | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getMockApplication(applicationId).then((data) => {
      if (!isMounted) {
        return;
      }

      setApplication(data);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Loading application
          </h1>
          <p className="text-sm text-muted-foreground">
            Fetching application details for {applicationId}.
          </p>
        </div>

        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">
            Loading mock API response...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Application not found
          </h1>
          <p className="text-sm text-muted-foreground">
            We could not find an application with ID "{applicationId}".
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/application/login">Try another ID</Link>
            </Button>
            <Button asChild>
              <Link href="/application/new">Start a new application</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Application details
          </h1>
          <p className="text-sm text-muted-foreground">
            Review the submitted information for {applicationId}.
          </p>
        </div>
        <Badge variant={getStatusVariant(application.status)}>
          {application.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applicant information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Name</TableCell>
                <TableCell className="font-medium">
                  {application.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Email</TableCell>
                <TableCell>{application.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Phone</TableCell>
                <TableCell>{formatPhone(application.phone)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">PAN</TableCell>
                <TableCell>{application.pan}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Date of birth
                </TableCell>
                <TableCell>{formatDate(application.dateOfBirth)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Declared salary
                </TableCell>
                <TableCell>{formatCurrency(application.salary)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Eligible limit
                </TableCell>
                <TableCell>{formatCurrency(application.limit)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/application/login">Back to login</Link>
        </Button>
        <Button asChild>
          <Link href="/application/new">Start a new application</Link>
        </Button>
      </div>
    </div>
  );
}
