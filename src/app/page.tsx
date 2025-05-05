import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir a /es
  redirect('/es');
  
  // Este contenido nunca se mostrará debido a la redirección
  return null;
}
