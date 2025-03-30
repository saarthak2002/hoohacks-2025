'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateUserInterests, getUserInterests } from '@/app/lib/interest_actions';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

async function saveInterestsToDB(interests: string[]) {
  console.log('Saving interests to DB:', interests);
  await updateUserInterests(interests);
}

export default function InterestSelector() {
  const [interests, setInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getCurrentInterests() {
        const currInterests = await getUserInterests();
        setInterests(currInterests);
    }
    getCurrentInterests();
  }, [])

  const addInterest = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInputValue('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveInterestsToDB(interests);
    setIsSaving(false);
    toast(`Your interests have been updated`);
  };

  return (
    <div className="w-full max-w-2xl p-4 rounded-lg border bg-muted/30">
        <h1 className='font-bold mb-2'>Interests</h1>
      <label className="block text-sm font-medium text-foreground mb-3">
        Tell us what you want to learn about for a personalized experience.
      </label>

      <div className="flex flex-wrap gap-2 mb-4">
        {interests.map((interest) => (
          <span
            key={interest}
            className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm font-medium"
          >
            {interest}
            <button
              onClick={() => removeInterest(interest)}
              className="hover:text-red-500"
              aria-label={`Remove ${interest}`}
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type an interest..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 h-12 text-base"
        />
        <Button onClick={addInterest} className="h-12 px-6">
          Add
        </Button>
        <Button variant="secondary" disabled={isSaving} onClick={handleSave} className="h-12 px-6">
            {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Toaster />
      </div>
    </div>
  );
}
