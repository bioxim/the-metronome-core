"use client";
import { useState } from 'react';
import RhythmChart from '@/components/RhythmChart';
import RhythmPanel from '@/components/RhythmPanel';

export default function DashboardPage() {
  // 🧠 Este es el "cerebro" que une al Panel con el Gráfico
  const [selectedAsset, setSelectedAsset] = useState('SOL');

  return (
    // 👇 Le dimos aire (padding) y un ancho máximo centrado para que no toque los bordes
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Le pasamos la moneda elegida al gráfico para que cambie de canal */}
          <RhythmChart
            selectedAsset={selectedAsset}
          />
        </div>
        <div className="lg:col-span-1">
          {/* Le pasamos la moneda y la función para cambiarla al panel */}
          <RhythmPanel selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} />
        </div>
      </div>
    </div>
  );
}