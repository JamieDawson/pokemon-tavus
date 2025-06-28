import { DialogWrapper } from "@/components/DialogWrapper";
import {
  DailyAudio,
  useDaily,
  useLocalSessionId,
  useParticipantIds,
  useVideoTrack,
  useAudioTrack,
} from "@daily-co/daily-react";
import React, { useCallback, useEffect, useState } from "react";
import Video from "@/components/Video";
import { conversationAtom } from "@/store/conversation";
import { useAtom, useAtomValue } from "jotai";
import { screenAtom } from "@/store/screens";
import { Button } from "@/components/ui/button";
import { endConversation } from "@/api/endConversation";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  PhoneIcon,
} from "lucide-react";
import {
  clearSessionTime,
  getSessionTime,
  setSessionStartTime,
  updateSessionEndTime,
} from "@/utils";
import { Timer } from "@/components/Timer";
import { TIME_LIMIT } from "@/config";
import { niceScoreAtom } from "@/store/game";
import { naughtyScoreAtom } from "@/store/game";
import { apiTokenAtom } from "@/store/tokens";

const timeToGoPhrases = [
  "I'll need to dash off soon—there’s I have to prepare for my next pokemon battle! You can give one last request!",
  "My Bulbasaur is getting hungry! But I've got a little more time for you!",
  "I'll be heading out soon—my pokemon are getting restless—but I'd love to hear one more thing before I go!",
];

const outroPhrases = [
  "It's time for me to go now—Gotta feed my pokemon! Take care, and I'll see you soon!",
  "I've got to get back to Lavender Town—my pokemon needs me! Be good, until we meet again!",
  "I must say goodbye for now!! Take care of your pokemon and I'll see you soon!",
];

const fetchPokemonData = async (pokemonName: string) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`,
    );
    if (!response.ok) throw new Error("Pokémon not found");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching Pokémon data:", error);
    return null;
  }
};

const getPokemonTypes = async (response: any) => {
  //Note: pokemon either have 1 or 2 types. There are no 3+ type pokemon

  let val = response.types.map((item) => item.type.name);

  if (val.length === 1) {
    return "This is is a " + val[0] + " type Pokemon!";
  } else {
    return "This pokemon is a " + val[0] + " and " + val[1] + " type Pokemon!";
  }
};


const getPokemonAbilities = async (response: any) => {
  const abilities = response.abilities.map((item: any) => item.ability.name);
  return "This Pokémon has the following abilities: " + abilities.join(", ");
};


const getPokemonWeightAndHeight = async (response: {
  height: number;
  weight: number;
}) => {
  const totalInches = response.height * 3.937;
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches % 12);

  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  const pounds = (response.weight * 0.220462).toFixed(1);

  return (
    "This pokemon is " +
    feet +
    " feet " +
    inches +
    " inches tall and weighs " +
    pounds +
    " pounds."
  );
};

const selectPokemontFact = async (pokemonName: string) => {
  const data =  await fetchPokemonData(pokemonName);

  if (!data) {
    return `I couldn’t fetch info about ${pokemonName}. Try again!`;
  }

  const randomNum = Math.floor(Math.random() * 3);

  switch (randomNum) {
    case 0: {
      const types = await getPokemonTypes(data);
      return types;
    }
    case 1: {
      const abilities = await getPokemonAbilities(data);
      return abilities;
    }
    case 2: {
      const heightAndWeight = await getPokemonWeightAndHeight(data);
      return heightAndWeight;
    }
    default:
      return "Couldn't get Pokémon info.";
  }

}


export const Conversation: React.FC = () => {
  const [conversation, setConversation] = useAtom(conversationAtom);
  const [, setScreenState] = useAtom(screenAtom);
  const [naughtyScore] = useAtom(naughtyScoreAtom);
  const [niceScore] = useAtom(niceScoreAtom);
  const token = useAtomValue(apiTokenAtom);

  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);
  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (remoteParticipantIds.length && !start) {
      setStart(true);
      setTimeout(() => daily?.setLocalAudio(true), 4000);
    }
  }, [remoteParticipantIds, start]);

  useEffect(() => {
    if (!remoteParticipantIds.length || !start) return;

    setSessionStartTime();
    const interval = setInterval(() => {
      const time = getSessionTime();
      if (time === TIME_LIMIT - 60) {
        daily?.sendAppMessage({
          message_type: "conversation",
          event_type: "conversation.echo",
          conversation_id: conversation?.conversation_id,
          properties: {
            modality: "text",
            text:
              timeToGoPhrases[Math.floor(Math.random() * 3)] ??
              timeToGoPhrases[0],
          },
        });
      }
      if (time === TIME_LIMIT - 10) {
        daily?.sendAppMessage({
          message_type: "conversation",
          event_type: "conversation.echo",
          conversation_id: conversation?.conversation_id,
          properties: {
            modality: "text",
            text:
              outroPhrases[Math.floor(Math.random() * 3)] ?? outroPhrases[0],
          },
        });
      }
      if (time >= TIME_LIMIT) {
        leaveConversation();
        clearInterval(interval);
      } else {
        updateSessionEndTime();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [remoteParticipantIds, start]);

  useEffect(() => {
    if (conversation?.conversation_url) {
      daily
        ?.join({
          url: conversation.conversation_url,
          startVideoOff: false,
          startAudioOff: true,
        })
        .then(() => {
          daily?.setLocalAudio(false);
        });
    }
  }, [conversation?.conversation_url]);

  useEffect(() => {
    const handlePokemonFact = async (
      pokemonName: string,
      conversationId: string | undefined,
    ) => {
      const fact = await selectPokemontFact(pokemonName);
      console.log("📘 Fact returned in prompt:", fact);

      setTimeout(() => {
        daily?.sendAppMessage({
          message_type: "conversation",
          event_type: "conversation.echo",
          conversation_id: conversationId,
          properties: {
            modality: "text",
            text: fact,
          },
        });

        console.log("📤 FINAL tool_response payload:", {
          message_type: "conversation",
          event_type: "conversation.echo",
          conversation_id: conversationId,
          properties: {
            modality: "text",
            text: fact,
          },
        });
      }, 1500);
    };

    const handleAppMessage = (event: any) => {
      const msg = event?.data;
      console.log("📨 what is msg!", msg);

      if (!msg?.properties) return;
      if (msg?.message_type !== "conversation") return;

      if (msg?.event_type === "conversation.tool_call") {
        console.log("🛠 Tool call received!", msg);

        const toolName = msg.properties?.name;
        const rawArgs = msg.properties?.arguments;

        if (!toolName || !rawArgs) {
          console.warn("⚠️ Missing tool name or arguments");
          return;
        }

        let args;
        try {
          args = JSON.parse(rawArgs);
        } catch (error) {
          console.error("❌ Failed to parse tool arguments:", error);
          return;
        }

        if (toolName === "get_pokemon_fact") {
          const pokemonName = args?.pokemon_name;
          console.log("🔍🔍🔍 Fetching fact for:", pokemonName);
          handlePokemonFact(pokemonName, conversation?.conversation_id);
        }
      } else if (msg?.event_type === "conversation.tool_response") {
        console.log("📦 Tool response acknowledged:", msg);
      } else if (
        msg?.event_type === "conversation.echo" ||
        msg?.event_type === "conversation.response"
      ) {
        console.log("💬 Regular LLM message received.");
      } else {
        console.log("🔔 Other conversation event:", msg?.event_type);
      }
    };

    daily?.on("app-message", handleAppMessage);
    return () => {
      daily?.off("app-message", handleAppMessage);
    };
  }, [daily, conversation]);

  const toggleVideo = useCallback(() => {
    daily?.setLocalVideo(!isCameraEnabled);
  }, [daily, isCameraEnabled]);

  const toggleAudio = useCallback(() => {
    daily?.setLocalAudio(!isMicEnabled);
  }, [daily, isMicEnabled]);

  const leaveConversation = useCallback(() => {
    daily?.leave();
    daily?.destroy();
    if (conversation?.conversation_id && token) {
      endConversation(token, conversation.conversation_id);
    }
    setConversation(null);
    clearSessionTime();

    const naughtyScorePositive = Math.abs(naughtyScore);
    if (naughtyScorePositive > niceScore) {
      setScreenState({ currentScreen: "naughtyForm" });
    } else {
      setScreenState({ currentScreen: "niceForm" });
    }
  }, [daily, token]);

  return (
    <DialogWrapper>
      <div className="absolute inset-0 size-full">
        <Timer />
        {remoteParticipantIds?.length > 0 && (
          <Video
            id={remoteParticipantIds[0]}
            className="size-full"
            tileClassName="!object-cover"
          />
        )}
        {localSessionId && (
          <Video
            id={localSessionId}
            tileClassName="!object-cover"
            className="absolute bottom-20 right-4 aspect-video h-40 w-24 overflow-hidden rounded-lg border-2 border-primary sm:bottom-12 lg:h-auto lg:w-52"
          />
        )}
        <div className="absolute bottom-8 right-1/2 z-10 flex translate-x-1/2 justify-center gap-4">
          <Button size="icon" variant="secondary" onClick={toggleAudio}>
            {!isMicEnabled ? (
              <MicOffIcon className="size-6" />
            ) : (
              <MicIcon className="size-6" />
            )}
          </Button>
          <Button size="icon" variant="secondary" onClick={toggleVideo}>
            {!isCameraEnabled ? (
              <VideoOffIcon className="size-6" />
            ) : (
              <VideoIcon className="size-6" />
            )}
          </Button>
          <Button
            size="icon"
            className="bg-[rgba(251,36,71,0.80)] backdrop-blur hover:bg-[rgba(251,36,71,0.60)]"
            variant="secondary"
            onClick={leaveConversation}
          >
            <PhoneIcon className="size-6 rotate-[135deg]" />
          </Button>
        </div>
        <DailyAudio />
      </div>
    </DialogWrapper>
  );
};
