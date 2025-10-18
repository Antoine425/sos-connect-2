import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SOS_BUTTONS } from '@/config/sos-config';
import { SOSType } from '@/types/sos';
import { cn } from '@/lib/utils';

interface SOSButtonsGridProps {
  onSOSClick: (type: SOSType, amount?: number) => void;
  disabled?: boolean;
}

export const SOSButtonsGrid = ({ onSOSClick, disabled = false }: SOSButtonsGridProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleButtonClick = (type: SOSType) => {
    if (type === 'financial' && !selectedAmount) {
      // Pour l'aide financière, on doit d'abord sélectionner un montant
      return;
    }
    onSOSClick(type, selectedAmount || undefined);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  return (
    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
      {SOS_BUTTONS.map((button) => (
        <div key={button.id} className="space-y-3">
          {/* Bouton principal */}
          <Button
            onClick={() => handleButtonClick(button.id)}
            disabled={disabled}
            className={cn(
              "w-40 h-40 rounded-full text-white font-bold relative overflow-hidden shadow-lg hover:shadow-xl",
              "hover:scale-105 active:scale-95 transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center p-0"
            )}
            style={{ 
              backgroundColor: button.color,
              borderColor: button.color
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center px-3 space-y-1">
              {button.title === 'Je suis en danger' && (
                <>
                  <span className="text-base font-bold leading-tight">Je suis</span>
                  <span className="text-base font-bold leading-tight">en danger</span>
                </>
              )}
              {button.title === 'Détresse médicale' && (
                <>
                  <span className="text-base font-bold leading-tight">Détresse</span>
                  <span className="text-base font-bold leading-tight">médicale</span>
                </>
              )}
              {button.title === 'Viens me chercher' && (
                <>
                  <span className="text-base font-bold leading-tight">Viens me</span>
                  <span className="text-base font-bold leading-tight">chercher</span>
                </>
              )}
              {button.title === 'Aide financière' && (
                <>
                  <span className="text-base font-bold leading-tight">Aide</span>
                  <span className="text-base font-bold leading-tight">financière</span>
                </>
              )}
            </div>
          </Button>

          {/* Sélecteur de montant pour l'aide financière */}
          {button.id === 'financial' && (
            <div className="flex gap-2 justify-center">
              {button.amountOptions?.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAmountSelect(amount)}
                  className={cn(
                    "h-8 px-3 text-sm font-medium transition-all",
                    selectedAmount === amount && "bg-white text-green-600 border-green-600"
                  )}
                  style={{
                    borderColor: selectedAmount === amount ? '#4CAF50' : undefined
                  }}
                >
                  {amount}€
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
