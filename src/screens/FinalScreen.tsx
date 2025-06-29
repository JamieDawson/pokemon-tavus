import {
  AnimatedTextBlockWrapper,
  DialogWrapper,
  StaticTextBlockWrapper,
} from "@/components/DialogWrapper";
import React from "react";

export const FinalScreen: React.FC = () => {
  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <StaticTextBlockWrapper
          imgSrc="/images/pikachu_ears_wiggle.gif"
          title="Thank you for using the Tavus Pokemon app"
          titleClassName="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary"
          description="We hope it helped you understand how to call an API with a tool_call in Tavus."
        />
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};
