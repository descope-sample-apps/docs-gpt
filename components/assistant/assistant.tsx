'use client';

import { Message, useAssistant } from 'ai/react';
import { MoveUp } from 'lucide-react';
import { useState } from 'react';
import Markdown from 'react-markdown'

const roleToColorMap: Record<Message['role'], string> = {
  system: 'red',
  user: 'black',
  function: 'blue',
  assistant: 'green',
  data: 'orange',
  tool: 'purple'
};

export default function Chat() {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: '/api/assistant' });

  return (
    <div className="w-full max-w-xl py-24 mx-auto stretch">
      {messages.length === 0 && (
        <div className="font-medium text-xl m-auto text-center w-full">Hey, it&apos;s Descope Assistant. How can I help you today?</div>
      )}
      {messages.map((m: Message) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap"
        >
          <strong
            style={{ color: roleToColorMap[m.role] }}
          >{`${m.role}: `}</strong>
          {m.role !== 'data' &&
            <Markdown>
               {m.content.replace(/\【\d+:.\†source\】/g, '')}
            </Markdown>}
          {/* {m.role === 'data' && (
            <>
              {(m.data as any).description}
              <br />
              <pre className={'bg-gray-200'}>
                {JSON.stringify(m.data, null, 2)}
              </pre>
            </>
          )} */}
          <br />
        </div>
      ))}

      {status === 'in_progress' && (
        <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
      )}

      <form onSubmit={submitMessage}
        className="fixed flex flex-row bottom-0 w-full max-w-xl px-1 mb-8 border border-gray-300 rounded shadow-xl align-bottom items-end"
      >
        <DynamicTextArea
          input={input}
          handleInputChange={handleInputChange}
          status={status}
          submitMessage={submitMessage}
        />

        <button
          disabled={!input || status !== 'awaiting_message'}
          type="submit"
          className={"bg-gray-300 rounded-md p-1 shadow-xl h-8 w-8 mb-1 transition" + (!input ? " opacity-50" : " hover:bg-gray-400")}
        >
          <MoveUp size={20} />
        </button>
      </form>
    </div>
  );
}

function DynamicTextArea({ input, handleInputChange, status, submitMessage }: {
  input: string, handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, 
  status: string, 
  submitMessage: any
}) {
  const [rows, setRows] = useState(1); // State to manage the row count of the textarea

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textAreaLineHeight = 24; // Line height of your textarea
    const previousRows = e.target.rows;
    e.target.rows = 1; // reset number of rows in textarea 
    const currentRows = ~~(e.target.scrollHeight / textAreaLineHeight);

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    if (currentRows >= 4) {
      e.target.rows = 4;
      e.target.scrollTop = e.target.scrollHeight;
    }

    setRows(currentRows < 4 ? currentRows : 4);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        submitMessage(e as unknown as React.FormEvent);
      }
    }
  };

  return <textarea
    disabled={status !== 'awaiting_message'}
    value={input}
    maxLength={500}
    rows={rows}
    placeholder="Message Descope Docs Assistant..."
    onChange={handleInputChange}
    onInput={handleInput}
    onKeyDown={handleKeyDown}
    className="w-full outline-none p-2 resize-none"
  />;
}