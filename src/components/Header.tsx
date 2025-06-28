import { memo } from "react";
import { useAtom } from "jotai";
import { Button } from "./ui/button";
import { Music } from "lucide-react";
import { isMusicMutedAtom, musicVolumeAtom } from "@/store/musicVolume";

export const Header = memo(() => {
  const [musicVolume, setMusicVolume] = useAtom(musicVolumeAtom);
  const [isMuted, setIsMuted] = useAtom(isMusicMutedAtom);

  const toggleMusic = () => {
    if (!isMuted && musicVolume === 0) {
      setMusicVolume(0.3);
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <header className="flex w-full items-start justify-between">
      <img
        src="/images/logo.svg"
        alt="Tavus"
        className="relative h-6 sm:h-10"
      />
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="relative size-10 sm:size-14"
        >
          <Music className="size-4 sm:size-6" />
          {(musicVolume === 0 || isMuted) && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 text-2xl font-thin sm:text-4xl">
              /
            </span>
          )}
        </Button>
      </div>
    </header>
  );
});
