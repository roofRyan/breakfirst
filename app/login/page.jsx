"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("所有欄位皆為必填");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "登入失敗");

      const user = data.user;

      sessionStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-pink-400 to-red-400 px-4">
      <div className="max-w-md w-full bg-white/30 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 transition-all">
        <h2 className="text-3xl font-extrabold text-center text-gray-700 drop-shadow mb-6">
          登入帳號
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center font-medium bg-red-100 p-2 rounded-md shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* 第三方登入按鈕 */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full bg-white text-gray-800 border border-gray-300 py-2 px-4 rounded-md flex items-center justify-center gap-2 shadow hover:bg-gray-50 transition"
          >
            <Image src="/google.png" alt="Google" width={24} height={24} />
            使用 Google 登入
          </button>

          <button
            type="button"
            onClick={() => signIn("github")}
            className="w-full bg-white text-gray-800 border border-gray-300 py-2 px-4 rounded-md flex items-center justify-center gap-2 shadow hover:bg-gray-50 transition"
          >
            <Image src="/github.png" alt="GitHub" width={24} height={24} />
            使用 GitHub 登入
          </button>
        </div>

        {/* 分隔線 */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-white/50" />
          <span className="mx-4 text-white/80 text-sm">或</span>
          <hr className="flex-grow border-t border-white/50" />
        </div>

        {/* 傳統帳密登入 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="密碼"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-500 text-white py-2 px-4 rounded-md shadow hover:bg-pink-600 transition"
          >
            {isSubmitting ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, type, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-800 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white/80 text-gray-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
      />
    </div>
  );
}
