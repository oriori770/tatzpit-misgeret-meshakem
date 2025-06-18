
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Plus, FileText, Users } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'new-request', label: 'הודעה חדשה', icon: Plus },
    { id: 'requests', label: 'צפייה בבקשות', icon: FileText },
    { id: 'add-soldier', label: 'הוספת חייל', icon: Users },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <Card className="hidden md:flex p-4 mb-6 bg-gradient-to-r from-green-800 to-green-700 text-white">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-2xl font-bold">מערכת הודעות חיילים</h1>
          </div>
          
          <nav className="flex gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className="flex items-center gap-2 text-white hover:bg-green-600"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Mobile Navigation */}
      <Card className="md:hidden p-4 mb-6 bg-gradient-to-r from-green-800 to-green-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-lg font-bold">מערכת הודעות חיילים</h1>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-green-600"
          >
            ☰
          </Button>
        </div>
        
        {isOpen && (
          <nav className="mt-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                onClick={() => {
                  onPageChange(item.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-white hover:bg-green-600 justify-start"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        )}
      </Card>
    </>
  );
}
