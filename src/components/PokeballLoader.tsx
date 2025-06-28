export const PokeballLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <img
        src="./images/pokeball_icon.png"
        alt="pokemon_icon"
        className="size-16 animate-spin-slow"
      />
      <p className="text-lg font-medium text-secondary">Loading...</p>
    </div>
  );
};
