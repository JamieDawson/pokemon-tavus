import {
  DialogWrapper,
  AnimatedTextBlockWrapper,
  StaticTextBlockWrapper,
} from "@/components/DialogWrapper";
import React from "react";

export const OutOfMinutes: React.FC = () => {
  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <StaticTextBlockWrapper
          imgSrc="/images/pikachu_clock.jpg"
          title="You've already chatted with your Pokemon Master today"
          description="Come back tomorrow to talk to them again. They'll be waiting!"
        />
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};
