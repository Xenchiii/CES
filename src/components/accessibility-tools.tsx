
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TextCursorInput, Accessibility } from 'lucide-react'; // Or use another suitable icon

export default function AccessibilityTools() {
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  // Add state for contrast if implementing contrast options

  // Load saved settings from local storage on mount
  useEffect(() => {
    const savedMultiplier = localStorage.getItem('fontSizeMultiplier');
    if (savedMultiplier) {
      const multiplier = parseFloat(savedMultiplier);
      setFontSizeMultiplier(multiplier);
      // Apply immediately if needed, or rely on initial render with the state value
      document.documentElement.style.setProperty('--font-size-multiplier', multiplier.toString());
    }
    // Load other settings like contrast here
  }, []);

  // Update CSS variable when slider changes
  const handleFontSizeChange = (value: number[]) => {
    const multiplier = value[0];
    setFontSizeMultiplier(multiplier);
    document.documentElement.style.setProperty('--font-size-multiplier', multiplier.toString());
    localStorage.setItem('fontSizeMultiplier', multiplier.toString());
  };

  // Placeholder for contrast change handler
  const handleContrastChange = (value: string) => {
     console.log("Contrast changed to:", value);
     // TODO: Implement logic to switch contrast themes/classes
     // Example: document.body.classList.remove('contrast-high', 'contrast-low');
     //          document.body.classList.add(`contrast-${value}`);
     //          localStorage.setItem('contrastMode', value);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Accessibility Settings"
        >
          <Accessibility className="h-[1.2rem] w-[1.2rem]" /> {/* Use Accessibility icon */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4" side="bottom" align="end">
        <div className="space-y-4">
          {/* Font Size Adjustment */}
          <div className="space-y-2">
            <Label htmlFor="font-size-slider" className="text-sm font-medium flex items-center gap-1">
               <TextCursorInput className="h-4 w-4 text-muted-foreground"/> Font Size ({fontSizeMultiplier.toFixed(1)}x)
            </Label>
            <Slider
              id="font-size-slider"
              min={0.8}
              max={1.5}
              step={0.1}
              value={[fontSizeMultiplier]}
              onValueChange={handleFontSizeChange}
              aria-label="Adjust Font Size"
            />
          </div>

          {/* TODO: Add Color Contrast Options */}
          {/* Example:
           <div className="space-y-2">
             <Label className="text-sm font-medium">Color Contrast</Label>
             <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={() => handleContrastChange('default')}>Default</Button>
               <Button variant="outline" size="sm" onClick={() => handleContrastChange('high')}>High</Button>
             </div>
           </div>
          */}

          {/* TODO: Add Screen Reader / Text-to-Speech Toggle (Requires external libraries) */}

        </div>
      </PopoverContent>
    </Popover>
  );
}
