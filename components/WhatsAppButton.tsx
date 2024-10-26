'use client';

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface WhatsAppButtonProps {
  whatsappNumber: string;
  projectTitle: string;
  projectId: string;
}

export function WhatsAppButton({ whatsappNumber, projectTitle, projectId }: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const websiteUrl = window.location.origin; // Gets the base URL of your website
    const projectUrl = `${websiteUrl}/projects/${projectId}`; // Creates the full project URL
    
    const message = encodeURIComponent(
      `Hi! I'm interested in your project "${projectTitle}".\n\n` +
      `Project Link: ${projectUrl}\n\n` +
      `I'd like to discuss collaboration opportunities.`
    );
    
    // Remove any non-digit characters except the plus sign
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      onClick={handleWhatsAppClick}
      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      Message on WhatsApp
    </Button>
  );
}
