
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { NewRequest } from '@/components/NewRequest';
import { RequestsView } from '@/components/RequestsView';
import { AddSoldier } from '@/components/AddSoldier';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('new-request');

  const renderPage = () => {
    switch (currentPage) {
      case 'new-request':
        return <NewRequest />;
      case 'requests':
        return <RequestsView />;
      case 'add-soldier':
        return <AddSoldier />;
      default:
        return <NewRequest />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        {renderPage()}
      </div>
    </div>
  );
};

export default Index;
