import LoginImage from '@/components/auth/auth-image';
import RegisterForm from '@/components/auth/register-form';

function Register() {
  return (
    <div className="flex min-h-screen w-full">
      <LoginImage />
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
