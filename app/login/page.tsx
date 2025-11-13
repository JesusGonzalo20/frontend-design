"use client";

import React, { useState } from "react";
import Whatsapp from "@/components/whatsapp/Index";
import { loginApi } from "@/lib/api";

type ResErrors = {
  message: string;
  errorContent: string;
};

type Auth = {
  email: string;
  password: string;
  role: boolean;
  token: string;
};

const dataForm: Auth = {
  email: "",
  password: "",
  role: true,
  token: "",
};

const Login: React.FC = () => {
  const [resErrors, setResErrors] = useState<ResErrors | null>(null);
  const [form, setForm] = useState<Auth>(dataForm);

  const handleFormData = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    textField: keyof Auth
  ) => {
    const { value } = target;
    setForm({ ...form, [textField]: value });
  };

  const saveToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  };

  const onSubmit = async () => {
    setResErrors(null);
    try {
      // 👇 usamos tu loginApi de lib/api.ts
      const { token } = await loginApi(form.email, form.password);

      if (!token) {
        setResErrors({
          message: "No se recibió token del servidor",
          errorContent: "",
        });
        return;
      }

      saveToken(token);
      // Redirige a la página después de login
      window.location.href = "/student"; // o "/download"
    } catch (error: any) {
      setResErrors({
        message: error?.message || "Error al iniciar sesión",
        errorContent: "",
      });
    }
  };

  const buttonStyle = {
    background: "linear-gradient(to right, #002e79, #006eb0)",
  };

  return (
    <section className="flex justify-center gradient-form h-full bg-neutral-100">
      <div className="container h-full p-10 mb-2 lg:mb-24 lg:mt-16 mt-0">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-gray-600">
          <div className="w-full">
            <div className="block rounded-3xl bg-neutral-200 shadow-lg">
              <div className="g-0 lg:flex lg:flex-wrap">
                {/* LADO FORMULARIO */}
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12">
                    <div className="text-center">
                      <img
                        className="mx-auto w-48"
                        src="/certificate/logo_cimade.png"
                        alt="logo"
                      />
                      <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold"></h4>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                      }}
                    >
                      <p className="flex justify-center text-gray-600 mb-8 font-semibold text-xl">
                        Iniciar sesión
                      </p>

                      {resErrors?.message && (
                        <span className="text-red-500 text-sm">
                          {resErrors.message}
                        </span>
                      )}

                      <div className="flex justify-center relative mb-6">
                        <input
                          type="text"
                          className="peer block min-h-[auto] lg:w-96 w-full rounded-lg border-2 border-gray-500 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none "
                          id="login-email"
                          placeholder="Email"
                          onChange={(event) => handleFormData(event, "email")}
                        />
                        <label htmlFor="login-email" className=""></label>
                      </div>

                      <div className="flex justify-center relative mb-4">
                        <input
                          type="password"
                          className="peer block min-h-[auto] lg:w-96 w-full rounded-lg border-2 border-gray-500 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none"
                          id="login-password"
                          placeholder="Password"
                          autoComplete="on"
                          onChange={(event) =>
                            handleFormData(event, "password")
                          }
                        />
                        <label htmlFor="login-password" className=""></label>
                      </div>

                      <div className="mb-12 pb-1 pt-1 text-center">
                        <button
                          className="mb-3 inline-block w-36 rounded-lg px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                          type="submit"
                          style={buttonStyle}
                        >
                          Iniciar sesión
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* LADO TEXTO */}
                <div
                  className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-3xl lg:rounded-bl-none"
                  style={buttonStyle}
                >
                  <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                    <h4 className="flex justify-center mb-6 text-xl font-semibold">
                      CIMADE
                    </h4>
                    <p className="text-lg font-semibold">
                      Cimade con una sólida trayectoria de 2 años, nuestra
                      institución se destaca por su compromiso en la formación
                      y desarrollo de profesionales. Ofrecemos cursos y
                      diplomados de alta calidad que impulsan el crecimiento y
                      la capacitación en áreas clave. Nuestra dedicación a la
                      excelencia educativa y la adaptabilidad a las demandas
                      del mercado nos permiten marcar una diferencia
                      significativa en la formación de profesionales.
                      <br />
                      <br />
                      Cimade con una sólida trayectoria de 4 años, nuestra
                      institución se destaca por su compromiso en la formación
                      y desarrollo de profesionales. Ofrecemos cursos y
                      diplomados de alta calidad que impulsan el crecimiento y
                      la capacitación en áreas clave. Nuestra dedicación a la
                      excelencia educativa y la adaptabilidad a las demandas
                      del mercado nos permiten marcar una diferencia
                      significativa en la formación de profesionales.
                    </p>
                  </div>
                </div>
                {/* FIN LADO TEXTO */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Whatsapp />
    </section>
  );
};

export default Login;
