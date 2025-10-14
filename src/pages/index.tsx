"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginValidationSchema } from "@/form/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@radix-ui/react-dropdown-menu";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoIosEye, IoIosEyeOff, IoMdMail } from "react-icons/io";
import { toast } from "react-toastify";
import { FaKey } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";

export default function Home() {
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = async (data: any) => {
    setError("");
    setIsLoading(true);

    const toastId = toast.loading("Processing request...");

    const res = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (res?.error) {
      setIsLoading(false);
      toast.update(toastId, {
        render: "Invalid username or password",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setError("Invalid username or password");
    } else {
      toast.update(toastId, {
        render: "Login successful",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => {
        window.location.href = "/home";
      }, 3000);
    }
  };

  const onEnter = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onEnter);

    return () => {
      document.removeEventListener("keydown", onEnter);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100">
        <ClipLoader size={50} color="#10375C" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
        <Image
          src="/assets/storySet/Group.png"
          alt="Login Illustration"
          width={600}
          height={600}
          className="w-full h-auto max-w-lg"
          priority
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center">
        <div className="bg-white p-8 md:px-12 md:py-8 rounded-xl shadow-xl flex flex-col w-full max-w-lg md:min-h-[500px] justify-start">
          <div className="mb-5 text-center md:text-left mt-2">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome to</h2>
            <h1 className="text-3xl font-black text-[#6358DC]">
              Worklog Management
            </h1>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 mt-3 flex flex-col"
          >
            <div className="flex flex-col border rounded-lg px-3 py-2 bg-gray-200">
              <Label
                htmlFor="username"
                className="text-xs font-medium text-gray-500 pl-7"
              >
                Username
              </Label>
              <div className="flex items-center">
                <IoMdMail className="w-5 h-5 text-black mr-2" />
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="username"
                      type="text"
                      className="w-full bg-transparent outline-none text-black placeholder-gray-500"
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col border rounded-lg px-3 py-2 bg-gray-200">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-gray-500 pl-7"
              >
                Password
              </Label>
              <div className="flex items-center">
                <FaKey className="w-5 h-5 text-black mr-2" />
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <input
                      {...field}
                      id="password"
                      type={isVisible ? "password" : "text"}
                      className="w-full bg-transparent outline-none text-black placeholder-gray-500"
                    />
                  )}
                />
                <div
                  className="ml-2 text-black cursor-pointer"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? (
                    <IoIosEyeOff size={20} />
                  ) : (
                    <IoIosEye size={20} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-[#6358DC] hover:underline font-medium"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              variant="secondary"
              type="submit"
              disabled={!isValid}
              className="w-full bg-[#6358DC] hover:bg-[#4F46E5] text-white"
            >
              Login
            </Button>
            <p className="text-center text-sm text-gray-600 mt-3">
              Don’t have an account?{" "}
              <a
                href="#"
                className="text-[#6358DC] font-semibold hover:underline"
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
