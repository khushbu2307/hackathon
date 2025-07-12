import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import "../../app/globals.css";
import "../../app/globals.css";

const SignupForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle signup logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-pink-100/60 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="backdrop-blur-lg bg-white/60 dark:bg-zinc-900/60 rounded-2xl shadow-2xl shadow-blue-200/30 dark:shadow-zinc-900/40 p-8 w-full max-w-md mx-4 border border-white/30 dark:border-zinc-800/40">
        <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Sign Up</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="mt-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-input transition duration-300 backdrop-blur-md"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Already have an account? </span>
          <Link href="/signin" className="text-blue-500 hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
