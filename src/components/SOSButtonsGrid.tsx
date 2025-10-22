import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SOS_BUTTONS } from '@/config/sos-config';
import { SOSType } from '@/types/sos';
import { cn } from '@/lib/utils';

interface SOSButtonsGridProps {
  onSOSClick: (type: SOSType, amount?: number) => void;
  disabled?: boolean;
  selectedType?: SOSType | null;
}

export const SOSButtonsGrid = ({ onSOSClick, disabled = false, selectedType }: SOSButtonsGridProps) => {
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
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
      {SOS_BUTTONS.map((button) => (
        <div key={button.id} className="space-y-3">
          {/* Bouton avec sélection de montant intégrée pour la recharge */}
          {button.id === 'financial' ? (
            <div 
              className={cn(
                "w-full rounded-2xl shadow-lg overflow-hidden transition-all duration-200",
                "border-2",
                selectedAmount ? "border-green-400" : "border-transparent"
              )}
              style={{ 
                background: `linear-gradient(135deg, ${button.color} 0%, ${button.color}dd 50%, ${button.color}aa 100%)`
              }}
            >
              {/* Titre et montants */}
              <div className="p-4 space-y-3">
                <h3 className="text-xl font-bold text-white text-center">
                  {button.title}
                </h3>
                
                {/* Boutons de montant fixes */}
                <div className="flex gap-2 justify-center">
                  {button.amountOptions?.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => handleAmountSelect(amount)}
                      className={cn(
                        "h-11 px-5 text-base font-bold rounded-xl transition-all",
                        selectedAmount === amount && !isCustom
                          ? "bg-white text-green-600 border-2 border-white shadow-md scale-105" 
                          : "bg-white/20 text-white border-2 border-white/40 hover:bg-white/30"
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
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Autre montant"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className={cn(
                      "flex-1 h-11 px-4 text-base font-bold rounded-xl transition-all text-center",
                      isCustom && customAmount
                        ? "bg-white text-green-600 border-2 border-white shadow-md" 
                        : "bg-white/20 text-white border-2 border-white/40 placeholder:text-white/60"
                    )}
                  />
                  <span className="text-white text-lg font-bold">€</span>
                </div>
              </div>

              {/* Bouton de validation */}
              <Button
                onClick={() => handleButtonClick(button.id)}
                disabled={disabled || (!selectedAmount && !isCustom) || (isCustom && !customAmount)}
                className={cn(
                  "w-full h-14 rounded-none bg-black/20 text-white font-bold",
                  "hover:bg-black/30 active:bg-black/40 transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-white/20"
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
              disabled={disabled}
              className={cn(
                "w-full h-20 rounded-2xl text-white font-bold relative overflow-hidden shadow-lg hover:shadow-xl",
                "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center px-6",
                "bg-gradient-to-br from-white/20 to-black/20"
              )}
              style={{ 
                background: `linear-gradient(135deg, ${button.color} 0%, ${button.color}dd 50%, ${button.color}aa 100%)`,
                borderColor: button.color
              }}
            >
              {/* Titre du bouton */}
              <span className="text-lg font-bold leading-tight text-center drop-shadow-lg">
                {button.title}
              </span>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
