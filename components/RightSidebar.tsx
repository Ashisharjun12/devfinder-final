'use client';

import { Button } from "./ui/button";
import { Users, MessageCircle, ArrowRight } from "lucide-react";

export function RightSidebar() {
  const handleJoinCommunity = () => {
    window.open('https://chat.whatsapp.com/B8aC6Tpt7EJA8ykRdEzK27', '_blank');
  };

  return (
    <div className="lg:w-80 space-y-6">
      {/* Community Card */}
      <div className="bg-gradient-to-br from-[#25D366]/10 to-transparent rounded-xl p-6 border border-[#25D366]/20 backdrop-blur-sm sticky top-24">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#25D366]" />
          Developer Community
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Join our WhatsApp community to connect with other developers and stay updated with latest projects.
        </p>
        <Button 
          onClick={handleJoinCommunity}
          className="w-full group relative overflow-hidden bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-2">
            <MessageCircle className="h-4 w-4 group-hover:animate-bounce" />
            Join Community
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
          </span>
        </Button>
      </div>

      {/* Stats Card */}
      <div className="bg-secondary/30 rounded-xl p-6 border border-primary/10 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Active Projects</span>
            <span className="font-medium">50+</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Developers</span>
            <span className="font-medium">200+</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Technologies</span>
            <span className="font-medium">100+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
