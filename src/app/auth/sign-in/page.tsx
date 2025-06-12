import { SignInForm } from "../_components/sign-in-form";

const AlphSignInPage = async () => {

  return (
    <div className="flex w-screen items-center justify-center">
      <div className="w-[400px]">
        <SignInForm />
      </div>
    </div>
  );
};

export default AlphSignInPage;
