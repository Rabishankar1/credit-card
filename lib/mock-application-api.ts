import { applicationType } from "@/lib/types/application";

type ApplicationDecisionStatus = "allowed" | "rejected";
type ApplicationReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CreateApplicationResponse = {
  applicationId: string;
  status: ApplicationDecisionStatus;
  limit: number;
};

export type ApplicationRecord = applicationType & {
  id: string;
  status: ApplicationReviewStatus;
  limit: number;
};

const seedApplications: Record<string, ApplicationRecord> = {
  "APP-1001": {
    id: "APP-1001",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: 9876543210,
    salary: 450000,
    pan: "ABCDE1234F",
    dateOfBirth: "1990-04-21",
    status: "PENDING",
    limit: 150000,
  },
  "APP-1002": {
    id: "APP-1002",
    name: "Anita Verma",
    email: "anita.verma@email.com",
    phone: 9123456780,
    salary: 300000,
    pan: "PQRSX9876K",
    dateOfBirth: "1992-11-05",
    status: "PENDING",
    limit: 90000,
  },
  "APP-1003": {
    id: "APP-1003",
    name: "Priya Nair",
    email: "priya.nair@email.com",
    phone: 9012345678,
    salary: 600000,
    pan: "LMNOP4321Q",
    dateOfBirth: "1988-07-14",
    status: "APPROVED",
    limit: 180000,
  },
  "APP-1004": {
    id: "APP-1004",
    name: "Arjun Mehta",
    email: "arjun.mehta@email.com",
    phone: 9988776655,
    salary: 180000,
    pan: "TUVWX6789J",
    dateOfBirth: "1995-02-09",
    status: "REJECTED",
    limit: 0,
  },
};

let applicationStore: Record<string, ApplicationRecord> = {
  ...seedApplications,
};

let nextId = 1003;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STORAGE_KEY = "mock-application-store";
const NEXT_ID_KEY = "mock-application-next-id";

const getStoredState = () => {
  let store = { ...applicationStore };

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, ApplicationRecord>;
        store = { ...store, ...parsed };
      }
    } catch {
      store = { ...applicationStore };
    }
  }

  let storedNextId: number | null = null;
  if (typeof window !== "undefined") {
    const rawNextId = window.localStorage.getItem(NEXT_ID_KEY);
    if (rawNextId) {
      const parsed = Number(rawNextId);
      if (Number.isFinite(parsed)) {
        storedNextId = parsed;
      }
    }
  }

  if (storedNextId === null) {
    const maxId = Object.keys(store).reduce((max, key) => {
      const match = key.match(/^APP-(\d+)$/);
      if (!match) {
        return max;
      }

      const value = Number(match[1]);
      if (Number.isNaN(value)) {
        return max;
      }

      return Math.max(max, value);
    }, 0);

    storedNextId = Math.max(nextId, maxId + 1);
  }

  return { store, nextId: storedNextId };
};

const persistState = (
  store: Record<string, ApplicationRecord>,
  nextIdValue: number,
) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.localStorage.setItem(NEXT_ID_KEY, String(nextIdValue));
  } catch {
    // Ignore storage failures and keep in-memory state.
  }
};

const buildDecision = (salary: number | undefined) => {
  if (salary === undefined || Number.isNaN(salary) || salary < 200000) {
    return { status: "rejected" as const, limit: 0 };
  }

  const limit = Math.min(Math.max(Math.round(salary * 0.3), 75000), 1000000);
  return { status: "allowed" as const, limit };
};

const resolveApplicationKey = (
  store: Record<string, ApplicationRecord>,
  id: string,
) => {
  const trimmedId = id.trim();
  const normalizedId = trimmedId.toUpperCase();

  if (store[normalizedId]) {
    return normalizedId;
  }

  if (store[trimmedId]) {
    return trimmedId;
  }

  if (store[id]) {
    return id;
  }

  return null;
};

export const getMockApplication = async (
  id: string,
): Promise<ApplicationRecord | null> => {
  await wait(350);
  const { store, nextId: storedNextId } = getStoredState();
  applicationStore = store;
  nextId = storedNextId;

  const resolvedKey = resolveApplicationKey(store, id);
  if (!resolvedKey) {
    return null;
  }

  return store[resolvedKey] ?? null;
};

export const createMockApplication = async (
  payload: applicationType,
): Promise<CreateApplicationResponse> => {
  await wait(650);

  const { store, nextId: storedNextId } = getStoredState();
  applicationStore = store;
  nextId = storedNextId;

  const { status, limit } = buildDecision(payload.salary);
  const applicationId = `APP-${nextId}`;
  const nextIdValue = nextId + 1;

  store[applicationId] = {
    id: applicationId,
    ...payload,
    status: status === "allowed" ? "PENDING" : "REJECTED",
    limit,
  };

  applicationStore = store;
  nextId = nextIdValue;
  persistState(store, nextIdValue);

  return { applicationId, status, limit };
};

export const listMockApplications = async (): Promise<ApplicationRecord[]> => {
  await wait(250);
  const { store, nextId: storedNextId } = getStoredState();
  applicationStore = store;
  nextId = storedNextId;

  return Object.values(store).sort((a, b) => a.id.localeCompare(b.id));
};

export const updateMockApplication = async (
  id: string,
  updates: Partial<Pick<ApplicationRecord, "status" | "limit">>,
): Promise<ApplicationRecord | null> => {
  await wait(350);
  const { store, nextId: storedNextId } = getStoredState();
  applicationStore = store;
  nextId = storedNextId;

  const resolvedKey = resolveApplicationKey(store, id);
  if (!resolvedKey) {
    return null;
  }

  const updated: ApplicationRecord = {
    ...store[resolvedKey],
    ...updates,
  };

  store[resolvedKey] = updated;
  applicationStore = store;
  persistState(store, nextId);

  return updated;
};
