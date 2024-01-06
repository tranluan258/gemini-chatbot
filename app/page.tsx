'use client';
import Markdown from '@/components/markdown';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ResponseData } from './api/send/route';

interface IChatMessage {
  clientMessage: string;
  serverMessage: string;
}

const ChatContainer = (): JSX.Element => {
  const [prompt, setPrompt] = useState<string>('');
  const [list, setList] = useState<IChatMessage[]>([]);

  const handleClick = (event: any) => {
    event.preventDefault();
    if (prompt === '') {
      return;
    }
    const savePrompt: string = prompt;
    setPrompt('');
    const loadingMessage: IChatMessage = {
      clientMessage: savePrompt,
      serverMessage: '...',
    };
    setList([...list, loadingMessage]);

    fetch('/api/send', {
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
        setList([...list, newMessage]);
      })
      .catch((error) => {
        console.error(error);
        setList(list.slice(0, list.length - 1));
        const newMessage: IChatMessage = {
          clientMessage: savePrompt,
          serverMessage: 'Error',
        };
        setList([...list, newMessage]);
      });
  };

  const handleClear = () => {
    setList([]);
  };

  return (
    <div className="h-screen w-screen">
      <div className="flex justify-around items-center h-[8%]">
        <div>
          <h1 className="font-bold">Gemini Chatbot</h1>
        </div>
        <div className="flex items-center">
          <ModeToggle />
          <Button className="ml-3" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center h-[90%]">
        <div className="w-[80%] max-h-[800px] h-[800px] p-5 m-10 shadow-2xl overflow-y-scroll overflow-auto overscroll-y-auto">
          <div>
            {list.map((item, index) => {
              return (
                <div key={index}>
                  <div className="flex justify-start">
                    <div className="bg-blue-500 rounded-md p-2 m-2 text-white">
                      {item.clientMessage}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-gray-500 rounded-md p-2 m-2 text-white">
                      <Markdown content={item.serverMessage} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-[70%] justify-center ">
          <form onSubmit={handleClick} className="flex w-full">
            <Input
              className="w-[80%] border-0 focus:ring-0 outline-none shadow-2xl"
              placeholder="Type prompt here..."
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
            />
            <Button className="rounded-md mx-2 px-3" type="submit">
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChatContainer;
