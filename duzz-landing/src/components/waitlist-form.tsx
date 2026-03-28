"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/components/analytics";

interface WaitlistFormProps {
  compact?: boolean;
}

export function WaitlistForm({ compact = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [eventInterest, setEventInterest] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist/count")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    trackEvent("waitlist_submit_attempt", { email_domain: email.split("@")[1] || "" });

    const referral =
      typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem("duzz_ref") || ""
        : "";

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, school, eventInterest, referral, honeypot }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        if (data.count) setCount(data.count);
        trackEvent("waitlist_submit_success");
      } else {
        setStatus("error");
        setMessage(data.message);
        trackEvent("waitlist_submit_error", { reason: data.message });
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-6 py-5 text-center">
        <div className="mb-1 text-lg font-semibold text-white">{message}</div>
        <p className="text-sm text-zinc-400">
          {count && count > 1
            ? `You're #${count} on the list.`
            : "You're one of the first."}
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 flex-1 rounded-lg border-zinc-800 bg-zinc-900/80 px-4 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
        />
        {/* Honeypot */}
        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-12 rounded-lg bg-blue-600 px-6 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {status === "loading" ? "Joining..." : "Join Waitlist"}
        </Button>
        {status === "error" && (
          <p className="text-sm text-red-400 sm:absolute sm:top-full sm:mt-2">{message}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-lg space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 rounded-lg border-zinc-800 bg-zinc-900/80 px-4 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
        />
        <Input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-lg border-zinc-800 bg-zinc-900/80 px-4 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
        />
        <Input
          type="text"
          placeholder="School (optional)"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="h-12 rounded-lg border-zinc-800 bg-zinc-900/80 px-4 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
        />
        <Input
          type="text"
          placeholder="Event interest (optional)"
          value={eventInterest}
          onChange={(e) => setEventInterest(e.target.value)}
          className="h-12 rounded-lg border-zinc-800 bg-zinc-900/80 px-4 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
        />
      </div>
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className="h-12 w-full rounded-lg bg-blue-600 px-8 text-base font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Join the Waitlist"}
      </Button>
      {status === "error" && <p className="text-center text-sm text-red-400">{message}</p>}
      {count !== null && count > 0 && (
        <p className="text-center text-sm text-zinc-500">
          Join {count.toLocaleString()} student{count !== 1 ? "s" : ""} already on DUZZ
        </p>
      )}
    </form>
  );
}
