import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "data", "waitlist.json");

export interface WaitlistUser {
  id: string;
  email: string;
  name: string;
  school: string;
  eventInterest: string;
  referral: string;
  createdAt: string;
}

interface DB {
  users: WaitlistUser[];
}

function ensureDB(): DB {
  if (!existsSync(DB_PATH)) {
    const { mkdirSync } = require("fs");
    mkdirSync(join(process.cwd(), "data"), { recursive: true });
    writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
  const data = readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function saveDB(db: DB) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function addUser(user: Omit<WaitlistUser, "id" | "createdAt">): {
  success: boolean;
  message: string;
  count?: number;
} {
  const db = ensureDB();

  if (db.users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { success: false, message: "This email is already on the waitlist." };
  }

  const newUser: WaitlistUser = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDB(db);

  return {
    success: true,
    message: "You're on the list. We'll notify you soon.",
    count: db.users.length,
  };
}

export function getStats() {
  const db = ensureDB();
  const users = db.users;
  const total = users.length;

  const dailyMap: Record<string, number> = {};
  users.forEach((u) => {
    const day = u.createdAt.split("T")[0];
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });

  const signupsPerDay = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return { total, signupsPerDay };
}

export function getCount(): number {
  const db = ensureDB();
  return db.users.length;
}
