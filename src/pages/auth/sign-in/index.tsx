import { AuthLayout } from "@/layouts/auth-layout";
import { SignInForm, FormValues } from "./forms/sign-in";
import { useSignInMutation } from "@/app/services/api";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/app/slices/auth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getCookieByName } from "@/utils";
import { Alert } from "@/components/shared";

export const SignIn = () => {
  const navigate = useNavigate();
  const [mutate, { isLoading }] = useSignInMutation();
  const [hasError, setHasError] = useState(false);
  const dispatch = useAppDispatch();

  const login = useCallback((token: string) => {
    dispatch(setToken(token));
    navigate("/");
  }, []);

  useEffect(() => {
    const token = getCookieByName("token");
    if (token) login(token);
  }, []);

  const handleOnSubmit = useCallback(async (values: FormValues) => {
    try {
      setHasError(false);
      const response = await mutate({
        email: values.email,
        password: values.password,
      }).unwrap();
      login(response.token);
    } catch {
      setHasError(true);
    }
  }, []);

  return (
    <AuthLayout>
      <div className="w-full md:w-1/2 lg:w-1/3">
        {hasError && (
          <Alert variant="danger" className="mb-4 font-medium">
            Invalid Login Credentials !
          </Alert>
        )}
        <div className="bg-white rounded-xl shadow-md px-10 py-14">
          <div className="mb-16">
            <h3 className="text-xl font-bold mb-0.5">Welcome Back!</h3>
            <p className="font-extralight text-gray-400 text-sm">
              Fill in your credentials in order to proceed
            </p>
          </div>
          <SignInForm loading={isLoading} onSubmit={handleOnSubmit} />
        </div>
      </div>
    </AuthLayout>
  );
};
