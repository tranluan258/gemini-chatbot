'use client';
import Markdown from '@/components/markdown';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { ResponseData } from './api/conversation/route';
import { Skeleton } from '@/components/ui/skeleton';

interface IChatMessage {
  clientMessage: string;
  serverMessage: string;
}

const ChatContainer = (): JSX.Element => {
  const [prompt, setPrompt] = useState<string>('');
  const historyRef = useRef<string[]>([]);
  const [list, setList] = useState<IChatMessage[]>([]);

  const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (prompt === '') {
      // TODO: Add error message
      return;
    }
    const savePrompt: string = prompt;
    setPrompt('');
    const loadingMessage: IChatMessage = {
      clientMessage: savePrompt,
      serverMessage: '',
    };
    setList([...list, loadingMessage]);
    historyRef.current.push(savePrompt);

    fetch('/api/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: savePrompt }),
    })
      .then((res) => res.json())
      .then(async (data: ResponseData) => {
        setList(list.slice(0, list.length - 1));
        const newMessage: IChatMessage = {
          clientMessage: savePrompt,
          serverMessage: data.text,
        };
        historyRef.current = [data.text];
        setList([...list, newMessage]);
      })
      .catch((error) => {
        console.error(error);
        setList(list.slice(0, list.length - 1));
        const newMessage: IChatMessage = {
          clientMessage: savePrompt,
          serverMessage: 'Error!! Please try again.',
        };
        setList([...list, newMessage]);
      });
  };

  return (
    <div className="h-screen w-screen">
      <div className="flex justify-around items-center h-[8%]">
        <div>
          <h1 className="font-bold">Gemini Chatbot</h1>
        </div>
        <div className="flex items-center">
          <ModeToggle />
          <Button className="ml-3" onClick={() => setList([])}>
            Clear
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center h-[90%]">
        <div className="w-1/2 max-h-[800px] h-[800px] p-5 m-10 overflow-hidden overscroll-y-auto overflow-y-auto">
          <div>
            {list.map((item, index) => {
              return (
                <div key={index} className="flex justify-start flex-col">
                  <div>
                    <h4 className="font-bold">You: </h4>
                    <div className={`rounded-md p-2 m-2  text-left`}>
                      {item.clientMessage}
                    </div>
                  </div>
                  <div>
                    {item.serverMessage === '' ? (
                      <div>
                        <h4 className="font-bold mb-2">Bot: </h4>
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[600px]" />
                            <Skeleton className="h-4 w-[600px]" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">Bot: </h4>
                        <div className={`rounded-md p-2 m-2  text-left`}>
                          <Markdown content={item.serverMessage} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-1/2 justify-center ">
          <form onSubmit={handleClick} className="flex w-full">
            <div className="relative w-full">
              <Input
                className={`w-full border-0 focus:ring-0 outline-none shadow-2xl bg-graytheme py-2 pr-10 pl-3 rounded-xl h-12`}
                placeholder="Type prompt here..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
              />
              <Button
                className={`absolute top-0 right-0 h-full p-4 rounded-xl bg-graytheme focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                type="submit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChatContainer;
