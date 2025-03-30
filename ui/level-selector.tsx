'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
// import { updateUserLevel, getUserLevel } from '@/app/lib/interest_actions'; // or another file

const LEVEL_OPTIONS = ['2nd Grade', '6th Grade', 'High School', 'College'];

export default function LevelSelector() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadLevel() {
    //   const level = await getUserLevel(); // e.g. returns '2nd Grader'
    //   setSelectedLevel(level);
    }
    loadLevel();
  }, []);

  const handleSave = async () => {
    if (!selectedLevel) return;
    setIsSaving(true);
    // await updateUserLevel(selectedLevel);
    setIsSaving(false);
    toast(`Your AI response level is now set to "${selectedLevel}"`);
  };

  return (
    <div className="w-full max-w-2xl p-4 rounded-lg border bg-muted/30">
      <h1 className="font-bold mb-2">Learning Level</h1>
      <Label className="block text-sm font-medium text-foreground mb-3">
        Choose how advanced DoomAI responses should be to fine-tune your learning.
      </Label>

      <div className="mb-4">
        <Select value={selectedLevel ?? ''} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full h-12 text-base">
            <SelectValue placeholder="Select a level" />
          </SelectTrigger>
          <SelectContent>
            {LEVEL_OPTIONS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSave} disabled={!selectedLevel || isSaving} className="h-12 px-6">
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
      <Toaster />
    </div>
  );
}
