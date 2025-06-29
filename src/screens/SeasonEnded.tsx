import {
  AnimatedTextBlockWrapper,
  DialogWrapper,
  StaticTextBlockWrapper,
} from "@/components/DialogWrapper";
import React from "react";

export const SeasonEnded: React.FC = () => {
  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <StaticTextBlockWrapper
          imgSrc="/images/pikachu_sleeping.jpg"
          title="Our pokemon are on vacation"
          description="We'll be back soon!"
        />
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};
