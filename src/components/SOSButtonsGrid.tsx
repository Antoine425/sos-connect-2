import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SOS_BUTTONS } from '@/config/sos-config';
import { SOSType } from '@/types/sos';
import { cn } from '@/lib/utils';

interface SOSButtonsGridProps {
  onSOSClick: (type: SOSType, amount?: number) => void;
  selectedType?: SOSType | null;
}

export const SOSButtonsGrid = ({ onSOSClick, selectedType }: SOSButtonsGridProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);

  const handleButtonClick = (type: SOSType) => {
    const finalAmount = isCustom ? parseInt(customAmount) || null : selectedAmount;
    
    if (type === 'financial' && !finalAmount) {
      // Pour l'aide financière, on doit d'abord sélectionner un montant
      return;
    }
    onSOSClick(type, finalAmount || undefined);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomAmount(numericValue);
    if (numericValue) {
      setIsCustom(true);
      setSelectedAmount(null);
    } else {
      setIsCustom(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
      {SOS_BUTTONS.map((button) => (
        <div key={button.id} className="space-y-4">
          {/* Bouton avec sélection de montant intégrée pour la recharge */}
          {button.id === 'financial' ? (
            <div 
              className={cn(
                "w-full rounded-3xl shadow-2xl overflow-hidden transition-all duration-300",
                "border-2 backdrop-blur-sm",
                selectedAmount ? "border-green-400 shadow-green-400/25" : "border-white/20 shadow-black/10",
                "hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]"
              )}
              style={{ 
                background: `linear-gradient(135deg, ${button.color} 0%, ${button.color}dd 50%, ${button.color}aa 100%)`,
                boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05)`
              }}
            >
              {/* Titre et montants */}
              <div className="p-4 space-y-3">
                <h3 className="text-xl font-bold text-white text-center">
                  {button.title}
                </h3>
                
                {/* Boutons de montant fixes */}
                <div className="flex gap-3 justify-center">
                  {button.amountOptions?.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => handleAmountSelect(amount)}
                      className={cn(
                        "h-12 px-6 text-base font-bold rounded-2xl transition-all duration-200",
                        "border-2 backdrop-blur-sm",
                        selectedAmount === amount && !isCustom
                          ? "bg-white text-green-600 border-white shadow-lg shadow-white/25 scale-105" 
                          : "bg-white/20 text-white border-white/40 hover:bg-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
                      )}
                    >
                      {amount}€
                    </Button>
                  ))}
                </div>

                {/* Séparateur */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-white/30"></div>
                  <span className="text-white/70 text-sm font-medium">ou</span>
                  <div className="flex-1 h-px bg-white/30"></div>
                </div>

                {/* Input pour montant personnalisé */}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Autre montant"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className={cn(
                      "flex-1 h-12 px-4 text-base font-bold rounded-2xl transition-all duration-200 text-center",
                      "border-2 backdrop-blur-sm",
                      isCustom && customAmount
                        ? "bg-white text-green-600 border-white shadow-lg shadow-white/25" 
                        : "bg-white/20 text-white border-white/40 placeholder:text-white/60 hover:bg-white/30 focus:bg-white/30 focus:outline-none"
                    )}
                  />
                  <span className="text-white text-lg font-bold">€</span>
                </div>
              </div>

              {/* Bouton de validation */}
              <Button
                onClick={() => handleButtonClick(button.id)}
                disabled={(!selectedAmount && !isCustom) || (isCustom && !customAmount)}
                className={cn(
                  "w-full h-16 rounded-none bg-black/20 text-white font-bold",
                  "hover:bg-black/30 active:bg-black/40 transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-white/20",
                  "backdrop-blur-sm shadow-lg"
                )}
              >
                {isCustom && customAmount 
                  ? `Envoyer la demande de ${customAmount}€` 
                  : selectedAmount 
                    ? `Envoyer la demande de ${selectedAmount}€` 
                    : 'Sélectionnez un montant'}
              </Button>
            </div>
          ) : (
            /* Bouton principal rectangulaire pour les autres types */
            <Button
              onClick={() => handleButtonClick(button.id)}
              className={cn(
                "w-full h-24 rounded-3xl text-white font-bold relative overflow-hidden",
                "shadow-2xl hover:shadow-3xl transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]",
                "flex items-center justify-center px-6",
                "border-2 border-white/20 backdrop-blur-sm",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
              )}
              style={{ 
                background: `linear-gradient(135deg, ${button.color} 0%, ${button.color}dd 50%, ${button.color}aa 100%)`,
                boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05)`
              }}
            >
              {/* Titre du bouton */}
              <span className="text-xl font-bold leading-tight text-center drop-shadow-lg relative z-10">
                {button.title}
              </span>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
