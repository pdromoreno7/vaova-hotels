import LoginForm from '@/components/auth/login-form';
import AuthImage from '@/components/auth/auth-image';

function Login() {
  return (
    <div className="flex min-h-screen w-full">
      <AuthImage />
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
