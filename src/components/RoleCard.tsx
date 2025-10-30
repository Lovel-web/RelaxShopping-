import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  onClick?: () => void;
}

export default function RoleCard({ icon, title, description, color = "bg-primary", onClick }: RoleCardProps) {
  return (
    <Card
      className={`p-6 text-center shadow-md hover:shadow-xl hover:scale-105 transition-transform border-t-4 ${color} border-opacity-70`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button onClick={onClick} className="gap-2">
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </Card>
  );
}
