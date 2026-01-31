import { NextResponse } from 'next/server';

export async function GET() {
  const approvals = [
    {
      applicationId: 'APP-1001',
      applicantName: 'Rahul Sharma',
      pan: 'ABCDE1234F',
      creditScore: 820,
      income: 450000,
      creditLimit: 100000,
      status: 'PENDING',
    },
    {
      applicationId: 'APP-1002',
      applicantName: 'Anita Verma',
      pan: 'PQRSX9876K',
      creditScore: 790,
      income: 300000,
      creditLimit: 75000,
      status: 'PENDING',
    },
    {
      applicationId: 'APP-1003',
      applicantName: 'Vikram Rao',
      pan: 'LMNOP6789Q',
      creditScore: 860,
      income: 800000,
      creditLimit: 1500000,
      status: 'PENDING',
    },
  ];

  return NextResponse.json(approvals);
}
