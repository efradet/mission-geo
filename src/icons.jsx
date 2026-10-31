import React from 'react';
import {ScanLine, KeyRound, Binary, Zap, Swords, Crosshair, Waypoints, Magnet, Languages, Brain} from 'lucide-react';

const icons = {ScanLine, KeyRound, Binary, Zap, Swords, Crosshair, Waypoints, Magnet, Languages, Brain};

export function MissionIcon({name, size = 20}) {
  const Icon = icons[name] || Zap;
  return <Icon size={size}/>;
}
