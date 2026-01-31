'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type Application = {
  applicationId: string;
  applicantName: string;
  pan: string;
  creditScore: number;
  income: number;
  creditLimit: number;
  status: ApplicationStatus;
};

export default function ApprovalsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [approveAppId, setApproveAppId] = useState<string | null>(null);
  const [rejectAppId, setRejectAppId] = useState<string | null>(null);
  const [editedLimits, setEditedLimits] = useState<Record<string, number>>({});

  useEffect(() => {
    await fetch(`${process.env.BASE_URL}/api/v1/approver/applications`)
      .then((res) => res.json())
      .then(setApplications);
  }, []);

  const confirmApprove = () => {
    setApplications((prev) =>
      prev.map((app) =>
        app.applicationId === approveAppId
          ? {
              ...app,
              status: 'APPROVED',
              creditLimit:
                editedLimits[app.applicationId] ?? app.creditLimit,
            }
          : app
      )
    );
    setApproveAppId(null);
  };

  const confirmReject = () => {
    setApplications((prev) =>
      prev.map((app) =>
        app.applicationId === rejectAppId
          ? { ...app, status: 'REJECTED' }
          : app
      )
    );
    setRejectAppId(null);
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle> Credit Card Applications</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>PAN</TableHead>
                <TableHead>Credit Score</TableHead>
                <TableHead>Income (₹)</TableHead>
                <TableHead>Credit Limit (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.applicationId}>
                  <TableCell>{app.applicationId}</TableCell>
                  <TableCell>{app.applicantName}</TableCell>
                  <TableCell>****{app.pan.slice(-4)}</TableCell>
                  <TableCell>{app.creditScore}</TableCell>
                  <TableCell>{app.income.toLocaleString()}</TableCell>

                  <TableCell>
                    {app.status === 'PENDING' && app.creditLimit > 500000 ? (
                      <Input
                        type="number"
                        className="w-32"
                        value={
                          editedLimits[app.applicationId] ??
                          app.creditLimit
                        }
                        onChange={(e) =>
                          setEditedLimits((prev) => ({
                            ...prev,
                            [app.applicationId]: Number(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      app.creditLimit.toLocaleString()
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        app.status === 'APPROVED'
                          ? 'default'
                          : app.status === 'REJECTED'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {app.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {app.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            setApproveAppId(app.applicationId)
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setRejectAppId(app.applicationId)
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={!!approveAppId} onOpenChange={() => setApproveAppId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveAppId(null)}
            >
              Cancel
            </Button>
            <Button onClick={confirmApprove}>
              Confirm Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectAppId} onOpenChange={() => setRejectAppId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectAppId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
