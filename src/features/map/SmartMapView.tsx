import React from 'react';
import { SmartMap } from '../../components/map/SmartMap';

export const SmartMapView: React.FC = () => {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative">
      <SmartMap />
    </div>
  );
};
