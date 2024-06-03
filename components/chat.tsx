// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { cn } from "@/lib/utils";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.codeMessage}>
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""), // default to return empty string
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // automitcally scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  const sendMessage = async (text) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId, toolCallOutputs) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSend = async (text) => {
    setIsLoading(true);
    sendMessage(text);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    handleSend(userInput);
  };

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta) => {
    const { value, annotations } = delta;
    let text = value;
    const citations: string[] = [];
    let index = 0;
    if (annotations) {
      for (let annotation of annotations) {
        // text = value.replace(annotation.text, " [" + index + "]");
        text = "";
        const { file_citation } = annotation;
        if (file_citation) {
          const { file_id } = file_citation;
          citations.push(file_id);
        }
        index++;
      }
    }

    appendToLastMessage(text);
  };

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta, snapshot) => {
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    setInputDisabled(false);
    setIsLoading(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  return (
    <div className={cn("max-w-xl max-h-screen overflow-y-hidden flex flex-col")}>
      <div className={cn("overflow-y-auto col-start-1 row-start-1 ")}>
        <div
          className={cn(styles.messages)}
        >
          {messages.length === 0 && <div className="font-medium text-xl m-auto text-left w-full">Hey, it&apos;s Descope Assistant. How can I help you today?</div>}

          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} text={msg.text} />
          ))}

          {isLoading && <div className="h-8 w-full mt-2 p-2 mb-8 text-left max-w-md bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />}
        </div>
      </div>
      <div className="col-start-1 row-start-1 bg-transparent pb-2">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            className={styles.input}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your question"
          />
          <button
            type="submit"
            className={styles.button}
            disabled={inputDisabled}
          >
            Send
          </button>
        </form>
      </div>
      {messages.length === 0 && <div className="grid grid-cols-2 gap-2">
        {starters.map((starter, index) => (
          <Starter key={index} handleSend={handleSend} starter={starter} />
        ))}
      </div>}
    </div>
  );

};

export default Chat;

const starters = [
  "How can Descope Flows be used to enhance user onboarding through progressive profiling?",
  "What are the benefits of using passkeys over traditional authentication methods with Descope?",
  "How does the nOTP feature via WhatsApp improve user authentication and reduce costs?",
  "What are the practical applications of integrating Descope with Retool for internal apps?"
]

function Starter({ starter, handleSend }: { starter: string, handleSend: (text: string) => void }) {
  return (
    <button onClick={() => handleSend(starter)} className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-1 text-xs">
      <p>{starter}</p>
    </button>
  )
}