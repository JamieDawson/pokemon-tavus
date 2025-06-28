import {
  AnimatedTextBlockWrapper,
  DialogWrapper,
} from "@/components/DialogWrapper";
import { PokeballLoader } from "@/components/PokeballLoader";
import React from "react";

export const ConversationLoading: React.FC = () => {
  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <div className="flex size-full items-center justify-center">
          <PokeballLoader />
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};
