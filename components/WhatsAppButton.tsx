'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsappNumber: string;
  projectTitle: string;
  projectId: string;
}

export function WhatsAppButton({ whatsappNumber, projectTitle, projectId }: WhatsAppButtonProps) {
  const handleWhatsAppChat = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your project "${projectTitle}"`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppChat}
      className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
    >
      <MessageCircle className="h-4 w-4" />
      Chat on WhatsApp
    </Button>
  );
}
