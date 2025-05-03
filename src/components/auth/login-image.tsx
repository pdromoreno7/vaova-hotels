import Image from 'next/image';

export default function LoginImage() {
  return (
    <div className="relative hidden w-1/2 flex-1 lg:block">
      <Image
        src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Tropical resort with pool at sunset"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 mix-blend-overlay" />
    </div>
  );
}
