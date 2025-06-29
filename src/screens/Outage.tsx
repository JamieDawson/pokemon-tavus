import {
  AnimatedTextBlockWrapper,
  DialogWrapper,
  StaticTextBlockWrapper,
} from "@/components/DialogWrapper";
import React from "react";

export const Outage: React.FC = () => {
  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <StaticTextBlockWrapper
          imgSrc="/images/pikachu_sleeping.jpg"
          title="We're busy hunting for Pokémon!"
          titleClassName="sm:max-w-full"
          description="Our Pokemon office is a bit overwhelmed. Hang tight — we'll fix this soon!"
        />
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};
