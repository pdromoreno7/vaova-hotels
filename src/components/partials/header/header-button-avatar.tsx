import { FC } from 'react';
import { Avatar, Button, Popover, PopoverTrigger, PopoverContent } from '@heroui/react';
import { LogOut } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface HeaderButtonAvatarProps {
  onLogout: () => void;
}

const HeaderButtonAvatar: FC<HeaderButtonAvatarProps> = ({ onLogout }) => {
  const { session } = useSession();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button isIconOnly variant="ghost" className="rounded-full">
          <Avatar
            src={session?.avatar || undefined}
            alt={session?.name || 'Avatar'}
            fallback={session?.name?.[0] || '?'}
            className="w-8 h-8"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex flex-col items-center">
          <span className="mb-2 text-sm font-medium">{session?.name}</span>
          <Button variant="ghost" className="w-full flex items-center gap-2" onPress={onLogout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderButtonAvatar;
