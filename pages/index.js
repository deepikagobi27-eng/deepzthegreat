import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  Copy,
  Check,
  Send,
  MessageCircle,
  Play,
  UserPlus,
  ArrowLeft,
  Sparkles,
  Pencil,
  Users,
} from "lucide-react";

import {
  onValue,
  ref,
  set,
  update,
  push,
  runTransaction,
} from "firebase/database";

import { db } from "../lib/firebase";

/* =========================================================
   GAME DATA
========================================================= */

const GAME_DATA = {
  easy: {
    name: "Easy",
    emoji: "🟢",

    truths: [
      "What was your first impression of me?",
      "What was the first thing you noticed about me?",
      "What is your favorite memory with me?",
      "What is one thing about my personality you really like?",
      "What is something I do that always makes you smile?",
      "When did you first realize you enjoyed talking to me?",
      "What's your favorite conversation we've ever had?",
      "What nickname would you give me?",
      "What's one thing about me that you find cute?",
      "What's something I do that you secretly find funny?",
      "Have you ever waited for me to come online?",
      "What's your favorite thing about our friendship/relationship?",
      "What song reminds you of me?",
      "What's one place you'd like to go with me?",
      "What's something you've learned about yourself because of me?",
      "What's one thing you think we have in common?",
      "What's one thing about me that surprised you?",
      "If you had to describe me in three words, what would they be?",
      "What's one moment with me you'd happily experience again?",
      "What's one thing you'd never want to change about us?",
    ],

    dares: [
      "Send me a selfie with your current expression.",
      "Send me a photo of something next to you right now.",
      "Send me a voice note saying my name in a funny way.",
      "Change my contact name to something that I choose.",
      "Send me the last emoji you used.",
      "Send me a song that reminds you of me.",
      "Send me a picture of your current view.",
      "Send me a voice note saying three nice things about me.",
      "Send me your most-used emoji 5 times.",
      "Let me choose your profile picture for 10 minutes.",
      "Send me a childhood photo you're comfortable sharing.",
      "Type a sentence using only emojis and make me guess it.",
      "Send me a random picture from your gallery that you're comfortable sharing.",
      "Record a 5-second voice note saying 'I have something to confess...' and then reveal something silly.",
      "Send me a picture of your handwriting.",
      "Let me choose one word you have to use in your next message.",
      "Send me a song and tell me why you picked it.",
      "Send me a photo of your favorite thing in your room.",
      "Record yourself saying a tongue twister.",
      "Send me a completely random fact about yourself.",
    ],
  },

  moderate: {
    name: "Moderate",
    emoji: "🟡",

    truths: [
      "Have you ever had a misunderstanding with me that you were afraid to bring up?",
      "What's something you've wanted to tell me but kept postponing?",
      "Have I ever hurt your feelings without realizing it?",
      "What's one thing you wish I understood better about you?",
      "Have you ever changed your behavior around me because you cared about my opinion?",
      "What's something about our relationship that makes you feel safe?",
      "What's one boundary you think we should always respect with each other?",
      "Have you ever worried that we'd become distant?",
      "What's something you think we need to improve between us?",
      "Have you ever disagreed with me but stayed quiet?",
      "What's one thing you think I misunderstand about you?",
      "Have you ever wanted an apology from me but never asked for one?",
      "What's one situation where you think we would probably argue?",
      "What do you think makes our connection different from your other friendships?",
      "What's something you would never want an outsider to misunderstand about us?",
      "If we had a serious argument, who do you think would apologize first?",
      "What's one thing you need from someone to feel genuinely valued?",
      "Have you ever wondered whether our relationship would survive a major disagreement?",
      "What's one promise you think we should make to each other?",
      "What do you think is the biggest strength of our relationship?",
    ],

    dares: [
      "Send me a voice note describing me in exactly five words.",
      "Let me choose your WhatsApp/Instagram status for 15 minutes.",
      "Send me a song that describes our relationship and explain your choice.",
      "Record a voice note telling me your favorite memory involving me.",
      "Send me a picture that represents your mood right now.",
      "Write a tiny 4-line poem about our friendship/relationship and send it.",
      "Let me ask you one question that you have to answer immediately.",
      "Send me a voice note telling me something you've never said to me before.",
      "Pick three photos from your gallery that remind you of three different memories with me.",
      "Send me the first photo you took today.",
      "Let me choose a harmless emoji that you have to put beside my contact name for one day.",
      "Send me a voice note explaining what you think makes us click.",
      "Describe our relationship using only movie/song titles.",
      "Send me a screenshot of your current playlist without revealing private chats or information.",
      "Write down the first five words that come to your mind when you think of me and send them.",
      "Let me choose a random topic and send me a 30-second voice-note opinion about it.",
      "Send me a photo of something you've kept for a long time and tell me its story.",
      "Tell me one thing you appreciate about me using a voice note.",
      "Send me a message written as if we had just met for the first time.",
      "Let me give you a harmless challenge that you have to complete within 10 minutes.",
    ],
  },

  juicy: {
    name: "Juicy",
    emoji: "❤️‍🔥",

    truths: [
      "Have you ever imagined me being your partner?",
      "What's the closest you've ever come to confessing something important to me?",
      "If i was a movie cahracter and song which i would be?",
      "What's one truth about us that you think we're both avoiding?",
      "Have you ever been scared of becoming too attached to me?",
      "how many people u slept with and wanna slept iwth whom?",
      "Have you ever liked someone who was already in a relationship?",
      "What's a truth about us that you think neither of us says openly?",
      "What's the most embarrassing thing you've done because you liked someone?",
      "If you could spend a day in someone else’s shoes, who would it be bt its not me?",
      "What's one moment between us that you think had more meaning than we admitted?",
      "Who was the last person who gave you butterflies?",
      "Have you ever stared at someone because you thought they were attractive and hoped they noticed?",
      "Who is the one person you would choose if you had to go on a date with someone you've ever liked?",
      "Have you ever changed your appearance because you knew someone said they like that?",
      "What is the most impulsive thing you ever did??",
      "What's the biggest 'what if' in ur life?",
      "What is your favorite way to be kissed?",
      "What outfit of mine is your absolute favorite??",
      "if i were an movie character and song wht it wuld be?",
    ],

    dares: [
      "Send me a voice note saying the most honest thing you've been wanting to tell me.",
      "Tell me one thing about our relationship that you've never admitted before.",
      "Send me the song that best represents your feelings about us right now.",
      "Write me a message beginning with: 'If I could tell you one thing without being scared...'",
      "Send me a voice note describing the moment you realized I became important to you.",
      "Tell me one 'what if' you've secretly thought about regarding us.",
      "Let me ask you one relationship question, and you must answer without avoiding it.",
      "Send me a message describing what you think our relationship could look like in the future.",
      "Tell me one thing you wish I understood about your feelings.",
      "Send me a voice note explaining what you would miss most if we stopped talking.",
      "Finish this sentence honestly: 'The thing about you that gets to me the most is...'",
      "Tell me one moment between us that you secretly think about sometimes.",
      "Send me a message starting with: 'I never told you this, but...'",
      "Tell me one thing you think we're both too scared to talk about.",
      "Give me a completely honest rating of how well you think we understand each other, and explain why.",
      "Tell me what you'd want to say to me if you knew I couldn't judge you.",
      "Send a voice note answering: 'What am I to you, really?'",
      "Tell me one thing you would change about our relationship if you could.",
      "Write the most honest message you can about us, without using the words 'love,' 'like,' or 'feelings.'",
      "Send me one final voice note saying something about me/us that you genuinely want me to remember.",
    ],
  },
};

const EMOJIS = [
  "😂",
  "😭",
  "❤️",
  "🤣",
  "😎",
  "✨",
  "🔥",
  "👀",
  "🙈",
  "🥹",
  "😌",
  "💜",
];

/* =========================================================
   HELPERS
========================================================= */

function makeRoomCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

/* =========================================================
   APP
========================================================= */
/* =========================================================
   CHAT COMPONENT
========================================================= */

function ChatBox({
  messages,
  playerId,
  chatText,
  setChatText,
  sendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  addEmoji,
}) {
  const inputRef = React.useRef(null);

  const handleSend = async () => {
    await sendMessage();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="mt-5 bg-white/90 rounded-3xl shadow-xl border border-purple-100 p-4">

      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={20} />
        <h3 className="font-bold">Chat</h3>
      </div>

      <div className="h-44 overflow-y-auto bg-purple-50 rounded-2xl p-3 space-y-2">

        {messages.length === 0 && (
          <div className="text-center text-purple-300 text-sm pt-14">
            Start chatting 💬
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.sender === playerId
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                message.sender === playerId
                  ? "max-w-[80%] bg-purple-600 text-white rounded-2xl rounded-br-sm px-3 py-2"
                  : "max-w-[80%] bg-white text-purple-900 rounded-2xl rounded-bl-sm px-3 py-2"
              }
            >
              <div className="text-[10px] opacity-60 mb-1">
                {message.senderName}
              </div>

              <div className="text-sm break-words">
                {message.text}
              </div>
            </div>
          </div>
        ))}

      </div>

      {showEmojiPicker && (
        <div className="flex flex-wrap gap-2 mt-3 bg-purple-50 rounded-2xl p-3">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                addEmoji(emoji);
                inputRef.current?.focus();
              }}
              className="text-2xl hover:scale-125 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-3">

        <button
          type="button"
          onClick={() =>
            setShowEmojiPicker(!showEmojiPicker)
          }
          className="w-11 h-11 flex-shrink-0 rounded-xl bg-purple-100"
        >
          😊
        </button>

        <input
          ref={inputRef}
          type="text"
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          autoComplete="off"
          className="flex-1 min-w-0 bg-purple-50 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-purple-300"
        />

        <button
          type="button"
          onClick={handleSend}
          className="w-11 h-11 flex-shrink-0 rounded-xl bg-purple-600 text-white flex items-center justify-center"
        >
          <Send size={18} />
        </button>

      </div>

    </div>
  );
}
export default function DeepzTheGreat() {
  const router = useRouter();

  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerId, setPlayerId] = useState("");

  const [screen, setScreen] = useState("home");
  const [room, setRoom] = useState(null);

  const [selectedLevel, setSelectedLevel] = useState("");

  const [customText, setCustomText] = useState("");
  const [chatText, setChatText] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     INITIALIZE FROM URL / LOCAL STORAGE
  ========================================================= */

  useEffect(() => {
    if (!router.isReady) return;

    const urlRoom = router.query.room;

    const savedPlayer = localStorage.getItem("deepz-player-id");
    const savedRoom = localStorage.getItem("deepz-room-code");
    const savedName = localStorage.getItem("deepz-player-name");

    if (savedName) {
      setPlayerName(savedName);
    }

    if (urlRoom) {
      const code = String(urlRoom).toUpperCase();

      setRoomCode(code);

      /*
       * If this browser already belongs to this room,
       * restore its player.
       */
      if (savedPlayer && savedRoom === code) {
        setPlayerId(savedPlayer);
        setScreen("lobby");
      } else {
        /*
         * New browser/device joining through share link.
         */
        setPlayerId("");
        setScreen("join");
      }

      return;
    }

    if (savedPlayer && savedRoom) {
      setPlayerId(savedPlayer);
      setRoomCode(savedRoom);
      setScreen("lobby");
    }
  }, [router.isReady, router.query.room]);

  /* =========================================================
     REALTIME ROOM LISTENER
  ========================================================= */

  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}`);

    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        const data = snapshot.val();

        console.log("ROOM UPDATE:", data);

        if (!data) {
          setRoom(null);

          if (playerId) {
            setScreen("home");
          }

          return;
        }

        setRoom(data);

        /*
         * Keep selected level in local React state too.
         */
        if (data.selectedLevel) {
          setSelectedLevel(data.selectedLevel);
        }

        /*
         * Only automatically change screen if this browser
         * is already one of the two players.
         */
        if (playerId === "p1" || playerId === "p2") {
          if (data.status === "lobby") {
            setScreen("lobby");
          }

          if (data.status === "playing") {
            setScreen("game");
          }
        }
      },
      (error) => {
        console.error("ROOM LISTENER ERROR:", error);

        alert(
          `Firebase error:\n${error.code}\n${error.message}`
        );
      }
    );

    return () => unsubscribe();
  }, [roomCode, playerId]);

  /* =========================================================
     CREATE ROOM
  ========================================================= */

  const createRoom = async () => {
    try {
      if (!playerName.trim()) {
        alert("Please enter your name.");
        return;
      }

      setLoading(true);

      let code = "";
      let created = false;

      /*
       * Try several random room codes.
       * This prevents accidentally overwriting an existing room.
       */
      for (let i = 0; i < 10; i++) {
        const possibleCode = makeRoomCode();

        const roomRef = ref(db, `rooms/${possibleCode}`);

        const result = await runTransaction(roomRef, (current) => {
          if (current !== null) {
            return;
          }

          return {
            status: "lobby",
            createdAt: Date.now(),

            players: {
              p1: {
                name: playerName.trim(),
              },
            },

            currentTurn: "p1",
            selectedLevel: null,
            challenge: null,
            chat: {},
          };
        });

        if (result.committed) {
          code = possibleCode;
          created = true;
          break;
        }
      }

      if (!created) {
        throw new Error(
          "Could not generate a unique room code. Please try again."
        );
      }

      localStorage.setItem("deepz-player-id", "p1");
      localStorage.setItem("deepz-room-code", code);
      localStorage.setItem(
        "deepz-player-name",
        playerName.trim()
      );

      setPlayerId("p1");
      setRoomCode(code);
      setSelectedLevel("");
      setScreen("lobby");

      await router.push(
        `/?room=${code}`,
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error("CREATE ROOM ERROR:", error);

      alert(
        `Could not create room.\n\n${error.code || ""}\n${
          error.message || error
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     JOIN ROOM
  ========================================================= */

  const joinRoom = async () => {
    try {
      if (!playerName.trim()) {
        alert("Please enter your name.");
        return;
      }

      const code = roomCode.trim().toUpperCase();

      if (!code) {
        alert("Enter the room code.");
        return;
      }

      setLoading(true);

      console.log("JOINING:", code);

      const roomRef = ref(db, `rooms/${code}`);

      /*
       * Atomically claim p2.
       *
       * This is much safer than:
       *
       *   read room
       *   check p2
       *   update p2
       *
       * because two people could otherwise try to join
       * simultaneously.
       */
      const result = await runTransaction(
        roomRef,
        (current) => {
          if (current === null) {
            return;
          }

          if (current.status === "playing") {
            return;
          }

          if (
            current.players &&
            current.players.p2
          ) {
            return;
          }

          return {
            ...current,

            players: {
              ...(current.players || {}),

              p2: {
                name: playerName.trim(),
              },
            },
          };
        }
      );

      if (!result.committed) {
        const current = result.snapshot.val();

        if (!current) {
          alert("Room not found.");
          return;
        }

        if (current.status === "playing") {
          alert("The game has already started.");
          return;
        }

        if (current.players?.p2) {
          alert("This room already has Player 2.");
          return;
        }

        alert("Could not join the room. Please try again.");
        return;
      }

      console.log("PLAYER 2 ADDED!");

      localStorage.setItem("deepz-player-id", "p2");
      localStorage.setItem("deepz-room-code", code);
      localStorage.setItem(
        "deepz-player-name",
        playerName.trim()
      );

      setPlayerId("p2");
      setRoomCode(code);
      setScreen("lobby");

      /*
       * Make sure URL contains the room.
       */
      await router.push(
        `/?room=${code}`,
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error("JOIN ROOM ERROR:", error);

      alert(
        `Could not join room.\n\n${
          error.code || "ERROR"
        }\n\n${error.message || error}`
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     START GAME
  ========================================================= */

  const startGame = async () => {
    try {
      if (playerId !== "p1") {
        return;
      }

      if (!room?.players?.p1) {
        alert("Player 1 is missing.");
        return;
      }

      if (!room?.players?.p2) {
        alert("Waiting for Player 2 to join.");
        return;
      }

      if (!selectedLevel) {
        alert("Choose a level first.");
        return;
      }

      await update(ref(db, `rooms/${roomCode}`), {
        status: "playing",
        selectedLevel,
        currentTurn: "p1",
        challenge: null,
      });
    } catch (error) {
      console.error("START GAME ERROR:", error);

      alert(
        `Could not start game.\n${error.message}`
      );
    }
  };

  /* =========================================================
     CHOOSE TRUTH / DARE
  ========================================================= */

  const chooseTruthOrDare = async (type) => {
    try {
      if (!room) return;

      if (room.currentTurn !== playerId) {
        return;
      }

      await update(ref(db, `rooms/${roomCode}`), {
        challenge: {
          type,
          level: room.selectedLevel,
          stage: "choose-source",
          source: null,
          text: "",
          createdBy: playerId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================================================
     GENERATED CHALLENGE
  ========================================================= */

  const chooseGenerated = async () => {
    try {
      const challenge = room?.challenge;

      if (!challenge) return;

      if (challenge.createdBy === playerId) {
        return;
      }

      const list =
        GAME_DATA[challenge.level]?.[
          challenge.type === "truth"
            ? "truths"
            : "dares"
        ];

      if (!list || list.length === 0) {
        alert("No challenges available.");
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * list.length
      );

      const randomChallenge = list[randomIndex];

      await update(ref(db, `rooms/${roomCode}`), {
        challenge: {
          ...challenge,
          stage: "active",
          source: "generated",
          text: randomChallenge,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================================================
     CUSTOM CHALLENGE
  ========================================================= */

  const chooseCustom = async () => {
    try {
      if (!room?.challenge) return;

      if (
        room.challenge.createdBy === playerId
      ) {
        return;
      }

      await update(ref(db, `rooms/${roomCode}`), {
        challenge: {
          ...room.challenge,
          stage: "custom",
          source: "custom",
        },
      });

      setCustomText("");
    } catch (error) {
      console.error(error);
    }
  };

  const submitCustom = async () => {
    try {
      if (!customText.trim()) {
        alert("Write something first.");
        return;
      }

      if (!room?.challenge) return;

      await update(ref(db, `rooms/${roomCode}`), {
        challenge: {
          ...room.challenge,
          stage: "active",
          source: "custom",
          text: customText.trim(),
        },
      });

      setCustomText("");
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================================================
     COMPLETE TURN
  ========================================================= */

  const completeTurn = async () => {
    try {
      if (!room) return;

      if (room.currentTurn !== playerId) {
        return;
      }

      const nextTurn =
        room.currentTurn === "p1"
          ? "p2"
          : "p1";

      await update(ref(db, `rooms/${roomCode}`), {
        currentTurn: nextTurn,
        challenge: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================================================
     CHAT
  ========================================================= */

  const sendMessage = async () => {
    try {
      if (!chatText.trim()) return;

      if (!roomCode || !playerId) return;

      const chatRef = ref(
        db,
        `rooms/${roomCode}/chat`
      );

      const newMessage = push(chatRef);

      await set(newMessage, {
        sender: playerId,

        senderName:
          room?.players?.[playerId]?.name ||
          playerName.trim(),

        text: chatText.trim(),

        timestamp: Date.now(),
      });

      setChatText("");
    } catch (error) {
      console.error("CHAT ERROR:", error);

      alert(
        `Could not send message.\n${error.message}`
      );
    }
  };

  const addEmoji = (emoji) => {
    setChatText((old) => old + emoji);
  };

  /* =========================================================
     CHAT MESSAGES
  ========================================================= */

  const messages = useMemo(() => {
    if (!room?.chat) return [];

    return Object.entries(room.chat)
      .map(([id, message]) => ({
        id,
        ...message,
      }))
      .sort(
        (a, b) =>
          (a.timestamp || 0) -
          (b.timestamp || 0)
      );
  }, [room?.chat]);

  /* =========================================================
     COPY LINK
  ========================================================= */

  const copyLink = async () => {
    try {
      const link =
        `${window.location.origin}/?room=${roomCode}`;

      await navigator.clipboard.writeText(link);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);

      alert(
        "Could not copy the link. Please copy the room code manually."
      );
    }
  };

  /* =========================================================
     LEAVE / RESET
  ========================================================= */

  const leaveRoom = () => {
    localStorage.removeItem("deepz-player-id");
    localStorage.removeItem("deepz-room-code");
    localStorage.removeItem("deepz-player-name");

    setPlayerId("");
    setRoomCode("");
    setRoom(null);
    setSelectedLevel("");
    setScreen("home");

    router.push("/", undefined, {
      shallow: true,
    });
  };


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <>
      <Head>
        <title>Deepz The Great</title>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-violet-200 p-4 text-purple-900">

        <div className="max-w-md mx-auto py-7">

          {/* HEADER */}

          <div className="text-center mb-6">

            <h1 className="text-4xl font-black text-purple-600">
              Deepz The Great
            </h1>

            <p className="text-purple-400 mt-2">
              Truth • Dare • Chaos ✨
            </p>

          </div>

          {/* =================================================
              HOME
          ================================================= */}

          {screen === "home" && (
            <div className="bg-white/90 rounded-3xl shadow-xl p-6">

              <label className="text-sm font-bold">
                Your Name
              </label>

              <input
                type="text"
                value={playerName}
                onChange={(e) =>
                  setPlayerName(e.target.value)
                }
                placeholder="Enter your name..."
                autoComplete="off"
                className="w-full mt-2 bg-purple-50 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-300"
              />

              <button
                onClick={createRoom}
                disabled={loading}
                className="w-full mt-5 bg-purple-600 disabled:bg-purple-300 text-white font-bold py-4 rounded-2xl flex justify-center gap-2"
              >
                <Play size={19} />

                {loading
                  ? "Creating..."
                  : "Create Game"}
              </button>

              <div className="text-center text-purple-300 my-4">
                OR
              </div>

              <input
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 6)
                  )
                }
                placeholder="ROOM CODE"
                className="w-full bg-purple-50 rounded-2xl px-4 py-4 text-center font-bold tracking-widest outline-none"
              />

              <button
                onClick={joinRoom}
                disabled={loading}
                className="w-full mt-3 border-2 border-purple-600 disabled:border-purple-200 disabled:text-purple-300 text-purple-600 font-bold py-4 rounded-2xl flex justify-center gap-2"
              >
                <UserPlus size={19} />

                {loading
                  ? "Joining..."
                  : "Join Game"}
              </button>

            </div>
          )}

          {/* =================================================
              JOIN
          ================================================= */}

          {screen === "join" && (
            <div className="bg-white/90 rounded-3xl shadow-xl p-6">

              <button
                onClick={() => {
                  setScreen("home");
                  setRoomCode("");
                  router.push("/", undefined, {
                    shallow: true,
                  });
                }}
                className="mb-5"
              >
                <ArrowLeft />
              </button>

              <h2 className="text-2xl font-black">
                Join Room
              </h2>

              <p className="text-purple-400 mt-2">
                Room:{" "}
                <strong>{roomCode}</strong>
              </p>

              <input
                value={playerName}
                onChange={(e) =>
                  setPlayerName(e.target.value)
                }
                placeholder="Your name..."
                autoComplete="off"
                className="w-full mt-5 bg-purple-50 rounded-2xl px-4 py-4 outline-none"
              />

              <button
                onClick={joinRoom}
                disabled={loading}
                className="w-full mt-4 bg-purple-600 disabled:bg-purple-300 text-white font-bold py-4 rounded-2xl"
              >
                {loading
                  ? "Joining..."
                  : "Join Now"}
              </button>

            </div>
          )}

          {/* =================================================
              LOBBY
          ================================================= */}

          {screen === "lobby" && room && (
            <div className="bg-white/90 rounded-3xl shadow-xl p-6">

              <div className="text-center">

                <p className="text-xs font-bold uppercase text-purple-400">
                  Your Room
                </p>

                <h2 className="text-4xl font-black tracking-widest text-purple-600 mt-1">
                  {roomCode}
                </h2>

                <button
                  onClick={copyLink}
                  className="mt-3 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-bold"
                >
                  {copied ? (
                    <>
                      <Check
                        className="inline"
                        size={16}
                      />{" "}
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy
                        className="inline"
                        size={16}
                      />{" "}
                      Copy Share Link
                    </>
                  )}
                </button>

              </div>

              {/* PLAYERS */}

              <div className="grid grid-cols-2 gap-3 mt-7">

                <div className="bg-purple-50 rounded-2xl p-4 text-center">

                  <Users className="mx-auto text-purple-500" />

                  <p className="font-bold mt-2 break-words">
                    {room.players?.p1?.name ||
                      "Waiting..."}
                  </p>

                  <span className="text-xs text-purple-400">
                    Player 1
                  </span>

                </div>

                <div
                  className={
                    room.players?.p2
                      ? "bg-green-50 rounded-2xl p-4 text-center"
                      : "bg-purple-50 rounded-2xl p-4 text-center"
                  }
                >

                  <Users
                    className={
                      room.players?.p2
                        ? "mx-auto text-green-500"
                        : "mx-auto text-purple-500"
                    }
                  />

                  <p className="font-bold mt-2 break-words">
                    {room.players?.p2?.name ||
                      "Waiting..."}
                  </p>

                  <span className="text-xs text-purple-400">
                    Player 2
                  </span>

                </div>

              </div>

              {/* PLAYER 2 CONNECTED */}

              {room.players?.p2 && (
                <div className="mt-5 bg-green-100 text-green-700 rounded-2xl p-3 text-center font-bold">
                  ✅ Player 2 has joined!
                </div>
              )}

              {/* LEVEL */}

              {playerId === "p1" && (
                <>
                  <h3 className="font-bold mt-7 mb-3 text-center">
                    Choose Your Level
                  </h3>

                  <div className="space-y-2">

                    {Object.entries(
                      GAME_DATA
                    ).map(
                      ([key, level]) => (
                        <button
                          key={key}
                          onClick={() =>
                            setSelectedLevel(
                              key
                            )
                          }
                          className={
                            selectedLevel ===
                            key
                              ? "w-full p-4 rounded-2xl bg-purple-600 text-white font-bold"
                              : "w-full p-4 rounded-2xl bg-purple-50 font-bold"
                          }
                        >
                          {level.emoji}{" "}
                          {level.name}
                        </button>
                      )
                    )}

                  </div>

                  <button
                    onClick={startGame}
                    disabled={
                      !room.players?.p2 ||
                      !selectedLevel ||
                      loading
                    }
                    className="w-full mt-5 bg-purple-600 disabled:bg-purple-200 text-white font-bold py-4 rounded-2xl"
                  >
                    Start Game 🎮
                  </button>
                </>
              )}

              {playerId === "p2" && (
                <div className="text-center mt-7 text-purple-400">

                  <div className="text-4xl mb-3">
                    ⏳
                  </div>

                  Waiting for Player 1 to choose
                  the level...

                </div>
              )}

              <button
                onClick={leaveRoom}
                className="w-full mt-5 text-sm text-red-400"
              >
                Leave Room
              </button>

            </div>
          )}

          {/* =================================================
              GAME
          ================================================= */}

          {screen === "game" && room && (
            <>
              <div className="bg-white/90 rounded-3xl shadow-xl p-6">

                {/* GAME INFO */}

                <div className="text-center">

                  <div className="text-sm text-purple-400 font-bold">

                    {
                      GAME_DATA[
                        room.selectedLevel
                      ]?.emoji
                    }{" "}

                    {
                      GAME_DATA[
                        room.selectedLevel
                      ]?.name
                    }{" "}
                    Level

                  </div>

                  <h2 className="text-2xl font-black mt-2">

                    {room.currentTurn ===
                    playerId
                      ? "Your Turn 🎮"
                      : `${
                          room.players?.[
                            room.currentTurn
                          ]?.name ||
                          "Other player"
                        }'s Turn`}

                  </h2>

                </div>

                {/* NO CHALLENGE */}

                {!room.challenge &&
                  room.currentTurn ===
                    playerId && (
                    <div className="mt-8">

                      <p className="text-center text-purple-400 mb-4">
                        Choose one 👀
                      </p>

                      <div className="grid grid-cols-2 gap-3">

                        <button
                          onClick={() =>
                            chooseTruthOrDare(
                              "truth"
                            )
                          }
                          className="bg-purple-600 text-white font-bold py-6 rounded-2xl text-lg"
                        >
                          🟣 Truth
                        </button>

                        <button
                          onClick={() =>
                            chooseTruthOrDare(
                              "dare"
                            )
                          }
                          className="bg-red-500 text-white font-bold py-6 rounded-2xl text-lg"
                        >
                          🔴 Dare
                        </button>

                      </div>

                    </div>
                  )}

                {/* WAITING */}

                {!room.challenge &&
                  room.currentTurn !==
                    playerId && (
                    <div className="text-center py-10">

                      <div className="text-5xl mb-4">
                        👀
                      </div>

                      <p className="text-purple-400">
                        Waiting for{" "}
                        {
                          room.players?.[
                            room.currentTurn
                          ]?.name
                        }
                        ...
                      </p>

                    </div>
                  )}

                {/* SOURCE CHOICE */}

                {room.challenge?.stage ===
                  "choose-source" && (
                  <div className="mt-7">

                    <div className="text-center mb-6">

                      <div className="text-5xl">
                        {room.challenge.type ===
                        "truth"
                          ? "🟣"
                          : "🔴"}
                      </div>

                      <h2 className="text-xl font-black mt-3">
                        Choose their{" "}
                        {room.challenge.type ===
                        "truth"
                          ? "Truth"
                          : "Dare"}
                      </h2>

                      <p className="text-sm text-purple-400 mt-2">
                        Pick a built-in one or
                        create your own.
                      </p>

                    </div>

                    {room.challenge.createdBy !==
                      playerId && (
                      <div className="space-y-3">

                        <button
                          onClick={
                            chooseGenerated
                          }
                          className="w-full bg-purple-600 text-white font-bold py-5 rounded-2xl flex justify-center items-center gap-2"
                        >
                          <Sparkles
                            size={20}
                          />
                          Generated
                        </button>

                        <button
                          onClick={
                            chooseCustom
                          }
                          className="w-full border-2 border-purple-600 text-purple-600 font-bold py-5 rounded-2xl flex justify-center items-center gap-2"
                        >
                          <Pencil
                            size={20}
                          />
                          Create My Own
                        </button>

                      </div>
                    )}

                    {room.challenge.createdBy ===
                      playerId && (
                      <div className="text-center py-8 text-purple-400">

                        <div className="text-4xl mb-3">
                          ⏳
                        </div>

                        Waiting for the other
                        player to choose...

                      </div>
                    )}

                  </div>
                )}

                {/* CUSTOM INPUT */}

                {room.challenge?.stage ===
                  "custom" &&
                  room.challenge.createdBy !==
                    playerId && (
                    <div className="mt-7">

                      <h2 className="font-black text-xl">
                        Create your{" "}
                        {room.challenge.type ===
                        "truth"
                          ? "Truth"
                          : "Dare"}
                      </h2>

                      <textarea
                        value={customText}
                        onChange={(e) =>
                          setCustomText(
                            e.target.value
                          )
                        }
                        placeholder={
                          room.challenge.type ===
                          "truth"
                            ? "Write your question..."
                            : "Write your dare..."
                        }
                        className="w-full h-32 mt-4 bg-purple-50 rounded-2xl p-4 outline-none resize-none focus:ring-2 focus:ring-purple-300"
                      />

                      <button
                        onClick={submitCustom}
                        className="w-full mt-3 bg-purple-600 text-white font-bold py-4 rounded-2xl"
                      >
                        Send Challenge
                      </button>

                    </div>
                  )}

                {room.challenge?.stage ===
                  "custom" &&
                  room.challenge.createdBy ===
                    playerId && (
                    <div className="text-center py-10 text-purple-400">

                      <div className="text-4xl mb-3">
                        ✏️
                      </div>

                      The other player is creating
                      your challenge...

                    </div>
                  )}

                {/* ACTIVE CHALLENGE */}

                {room.challenge?.stage ===
                  "active" && (
                  <div className="mt-7">

                    <div
                      className={
                        room.challenge.type ===
                        "truth"
                          ? "bg-purple-50 rounded-3xl p-7 text-center"
                          : "bg-red-50 rounded-3xl p-7 text-center"
                      }
                    >

                      <div className="text-5xl mb-4">
                        {room.challenge.type ===
                        "truth"
                          ? "🟣"
                          : "🔴"}
                      </div>

                      <p className="text-xs uppercase font-bold opacity-50">
                        {room.challenge.type}
                      </p>

                      <h2 className="text-xl font-bold leading-relaxed mt-3">
                        {room.challenge.text}
                      </h2>

                      <p className="text-xs opacity-40 mt-4">
                        {room.challenge.source ===
                        "generated"
                          ? "✨ Built-in challenge"
                          : "✏️ Custom challenge"}
                      </p>

                    </div>

                    {room.currentTurn ===
                      playerId && (
                      <button
                        onClick={completeTurn}
                        className="w-full mt-5 bg-purple-600 text-white font-bold py-4 rounded-2xl"
                      >
                        Done — Next Turn →
                      </button>
                    )}

                    {room.currentTurn !==
                      playerId && (
                      <p className="text-center text-purple-400 mt-5">
                        Waiting for{" "}
                        {
                          room.players?.[
                            room.currentTurn
                          ]?.name
                        }
                        ...
                      </p>
                    )}

                  </div>
                )}

              </div>

              <ChatBox
  messages={messages}
  playerId={playerId}
  chatText={chatText}
  setChatText={setChatText}
  sendMessage={sendMessage}
  showEmojiPicker={showEmojiPicker}
  setShowEmojiPicker={setShowEmojiPicker}
  addEmoji={addEmoji}
/>
            </>
          )}

        </div>
      </main>
    </>
  );
}