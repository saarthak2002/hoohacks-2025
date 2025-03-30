import InterestSelector from "@/ui/interest-selector";
import LevelSelector from "@/ui/level-selector";

export default async function Page() {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Preferences</h1>
        <p className="text-muted-foreground mb-6">Customize your learning experience.</p>
        <InterestSelector />
        <LevelSelector />
      </div>
    );
  }
  