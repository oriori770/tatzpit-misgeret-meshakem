
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/hooks/useData';
import { Copy, Eye, Edit } from 'lucide-react';

export function RequestsView() {
  const { requests, updateRequestStatus, getSoldierById } = useData();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const filteredRequests = requests.filter(request => {
    const soldier = getSoldierById(request.soldierId);
    if (!soldier) return false;

    const matchesSearch = soldier.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || soldier.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ממתינה': return 'bg-yellow-100 text-yellow-800';
      case 'אושרה': return 'bg-green-100 text-green-800';
      case 'נדחתה': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'single-day': return 'הצטרפות חד-יומית';
      case 'multi-day': return 'הצטרפות עם לינה';
      case 'replacement': return 'הצטרפות והחלפה';
      case 'departure': return 'עזיבת בסיס';
      default: return type;
    }
  };

  const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "הועתק בהצלחה",
      description: "ההודעה הועתקה ללוח",
    });
  };

  const handleStatusChange = (requestId: string, newStatus: 'ממתינה' | 'אושרה' | 'נדחתה') => {
    updateRequestStatus(requestId, newStatus);
    toast({
      title: "עודכן בהצלחה",
      description: "סטטוס הבקשה עודכן",
    });
  };

  const uniqueDepartments = [...new Set(requests.map(req => {
    const soldier = getSoldierById(req.soldierId);
    return soldier?.department;
  }).filter(Boolean))];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">צפייה בבקשות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="search">חיפוש לפי שם חייל</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="הכנס שם חייל..."
              />
            </div>
            
            <div>
              <Label htmlFor="statusFilter">סינון לפי סטטוס</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  <SelectItem value="ממתינה">ממתינה</SelectItem>
                  <SelectItem value="אושרה">אושרה</SelectItem>
                  <SelectItem value="נדחתה">נדחתה</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="departmentFilter">סינון לפי מדור</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המדורים</SelectItem>
                  {uniqueDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>רשימת בקשות</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">לא נמצאו בקשות התואמות לקריטריונים</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם החייל</TableHead>
                  <TableHead>מ.א.</TableHead>
                  <TableHead>סוג בקשה</TableHead>
                  <TableHead>מדור</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                  <TableHead>מפקד</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const soldier = getSoldierById(request.soldierId);
                  if (!soldier) return null;

                  return (
                    <TableRow 
                      key={request.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedRequest(request.id)}
                    >
                      <TableCell className="font-medium">{soldier.fullName}</TableCell>
                      <TableCell>{soldier.personalNumber}</TableCell>
                      <TableCell>{getRequestTypeLabel(request.type)}</TableCell>
                      <TableCell>{soldier.department}</TableCell>
                      <TableCell>{new Date(request.createdDate).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell>{request.commanderName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>עדכון סטטוס בקשה</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p><span className="font-medium">חייל:</span> {soldier.fullName}</p>
                                <p><span className="font-medium">סוג בקשה:</span> {getRequestTypeLabel(request.type)}</p>
                                
                                <div className="space-y-2">
                                  <Label>סטטוס חדש:</Label>
                                  <div className="flex gap-2">
                                    <Button
                                      variant={request.status === 'ממתינה' ? 'default' : 'outline'}
                                      onClick={() => handleStatusChange(request.id, 'ממתינה')}
                                      className="flex-1"
                                    >
                                      ממתינה
                                    </Button>
                                    <Button
                                      variant={request.status === 'אושרה' ? 'default' : 'outline'}
                                      onClick={() => handleStatusChange(request.id, 'אושרה')}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      אושרה
                                    </Button>
                                    <Button
                                      variant={request.status === 'נדחתה' ? 'default' : 'outline'}
                                      onClick={() => handleStatusChange(request.id, 'נדחתה')}
                                      className="flex-1 bg-red-600 hover:bg-red-700"
                                    >
                                      נדחתה
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyMessage(request.message)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog for viewing request details */}
      <Dialog open={selectedRequest !== null} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              פרטי הבקשה - {selectedRequest && getSoldierById(requests.find(r => r.id === selectedRequest)?.soldierId || '')?.fullName}
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <Textarea
                value={requests.find(r => r.id === selectedRequest)?.message || ''}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
              <Button
                onClick={() => copyMessage(requests.find(r => r.id === selectedRequest)?.message || '')}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                העתק הודעה
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
