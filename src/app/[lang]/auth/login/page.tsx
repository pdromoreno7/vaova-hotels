import LoginForm from '@/components/auth/login-form';
import LoginImage from '@/components/auth/login-image';

function Login() {
  return (
    <div className="flex min-h-screen w-full">
      <LoginImage />
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
