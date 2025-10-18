import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SOSHistoryCard, SOSStatus } from "@/components/SOSHistoryCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

// Mock data
const mockHistory = [
  {
    id: "1",
    type: "medical",
    date: "18/10/2025",
    time: "14:30",
    status: "approved" as SOSStatus,
    amount: 50,
    message: "Besoin de médicaments urgents",
  },
  {
    id: "2",
    type: "transport",
    date: "15/10/2025",
    time: "09:15",
    status: "pending" as SOSStatus,
    amount: 30,
    message: "Problème avec ma voiture",
  },
  {
    id: "3",
    type: "housing",
    date: "12/10/2025",
    time: "18:45",
    status: "rejected" as SOSStatus,
    amount: 200,
    message: "Réparation urgente dans l'appartement",
  },
  {
    id: "4",
    type: "other",
    date: "08/10/2025",
    time: "11:20",
    status: "approved" as SOSStatus,
    message: "Urgence familiale",
  },
];

const History = () => {
  const navigate = useNavigate();
  const [history] = useState(mockHistory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="container max-w-md mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Historique des SOS</h1>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-md mx-auto px-4 py-6">
        {history.length === 0 ? (
          <div className="text-center space-y-6 py-16">
            <div className="flex justify-center">
              <div className="bg-muted rounded-full p-6">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Aucun SOS envoyé</h2>
              <p className="text-muted-foreground">
                Vos demandes d'urgence apparaîtront ici
              </p>
            </div>
            <Button onClick={() => navigate("/")} size="lg" className="mt-4 rounded-full">
              Envoyer un SOS
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              {history.length} SOS envoyé{history.length > 1 ? "s" : ""}
            </p>
            
            <div className="space-y-4">
              {history.map((item) => (
                <SOSHistoryCard key={item.id} {...item} />
              ))}
            </div>

            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full h-14 text-lg mt-8 rounded-full"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Envoyer un nouveau SOS
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
