"use client"

import { useState, useActionState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { X, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { newMessage } from "@/app/lib/chat_actions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble } from "@/components/ui/chat/chat-bubble";
import { ChatBubbleAvatar } from "@/components/ui/chat/chat-bubble";
import { ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";

interface ImageCardProps {
  imageUrl: string
  title: string
  subtitle: string
  description: string
  alt: string
}

export default function ImageCard({
  imageUrl = "/placeholder.svg?height=400&width=600",
  title = "Card Title",
  subtitle = "Card subtitle with additional information",
  description = "This is a longer description that provides more details about this card. It will be shown when the card is expanded.",
  alt = "Card image",
}: ImageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const [messages, setMessages] = useState([
    {
      id: 1,
      message: `Hello, what can I help you learn about ${title}?`,
      sender: 'bot',
      isLoading: false
    },
  ]);

  const [messageFormIsPending, setMessageFormIsPending] = useState(false);

  async function handleNewMessageSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message")?.toString().trim();
    const title = formData.get("title")?.toString();

    if (!message) return;

    const newUserMessage = {
      id: Date.now(),
      message: message,
      sender: 'user',
      isLoading: false
    };
    setMessages(prev => [...prev, newUserMessage]);
    event.currentTarget.reset();

    // loading message
    const loadingMessageId = Date.now() + 1;
    setMessages(prev => [
      ...prev,
      {
        id: loadingMessageId,
        message: '',
        sender: 'bot',
        isLoading: true
      }
    ]);
    
    setMessageFormIsPending(true);
    const reply = await newMessage(formData);
    setMessageFormIsPending(false);

    setMessages(prev => prev.map(msg =>
      msg.id === loadingMessageId
        ? { ...msg, message: reply, isLoading: false }
        : msg
    ));

    console.log(message);
    console.log(title);
  }

  return (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div
          layoutId={`card-${title}`}
          initial={{ opacity: 0.8, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setIsExpanded(false)}
        >
          <motion.div
            layoutId={`card-container-${title}`}
            className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] bg-card rounded-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container with responsive height */}
            <motion.div
              layoutId={`card-image-${title}`}
              className="relative w-full"
              style={{
                height: "min(70vh, 700px)",
              }}
            >
              <Image src={imageUrl || "/placeholder.svg"} alt={alt} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </motion.div>

            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Content area with scrolling */}
            <div className="p-4 md:p-6 overflow-y-auto flex-grow">
              <motion.h2 layoutId={`card-title-${title}`} className="text-xl md:text-2xl font-bold mb-2">
                {title}
              </motion.h2>
              <motion.p layoutId={`card-subtitle-${title}`} className="text-muted-foreground mb-4">
                {subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <p className="text-sm md:text-base leading-relaxed">{description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      Learn More
                    </DialogTrigger>
                    <DialogContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl">
                      <DialogHeader>
                        <DialogTitle>DoomAI</DialogTitle>
                        <DialogDescription>
                          Learn more about {title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="overflow-y-scroll max-h-100">
                        <ChatMessageList>
                          {messages.map((message, index) => {
                            const variant = message.sender === 'user' ? 'sent' : 'received';
                            return(
                              <ChatBubble key={message.id} variant={variant}>
                                <ChatBubbleAvatar fallback={variant === 'sent' ? 'ME' : 'AI'} />
                                <ChatBubbleMessage isLoading={message.isLoading}>
                                  {message.message}
                                </ChatBubbleMessage>
                              </ChatBubble>
                            )
                          })}
                        </ChatMessageList>
                      </div>
                      <form
                        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                        onSubmit={handleNewMessageSubmit}
                      >
                        <ChatInput
                          placeholder="Type your message here..."
                          className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                          name="message"
                        />
                        <input type="hidden" name="title" value={title}/>
                        <div className="flex items-center p-3 pt-0">
                          <Button
                            size="sm"
                            className="ml-auto gap-1.5"
                            aria-disabled={messageFormIsPending}
                            disabled={messageFormIsPending}
                          >
                            Send Message
                            <CornerDownLeft className="size-3.5" />
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <button className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                    Save
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          layoutId={`card-${title}`}
          className="h-full"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 30 }}
        >
          <Card
            className="relative h-full overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-shadow py-0"
            onClick={() => setIsExpanded(true)}
          >
            <motion.div layoutId={`card-container-${title}`} className="h-full flex flex-col">
              <motion.div layoutId={`card-image-${title}`} className="relative aspect-[16/9] w-full">
                <Image src={imageUrl || "/placeholder.png"} alt={alt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </motion.div>
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <motion.h2 layoutId={`card-title-${title}`} className="text-lg md:text-xl font-bold text-white mb-1">
                  {title}
                </motion.h2>
                <motion.p layoutId={`card-subtitle-${title}`} className="text-sm text-white/80">
                  {subtitle}
                </motion.p>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

