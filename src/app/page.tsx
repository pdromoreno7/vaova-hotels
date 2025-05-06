import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /es
  redirect('/es');

  // This content will never be shown due to the redirect
  return null;
}
