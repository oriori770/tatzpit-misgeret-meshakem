
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/hooks/useData';
import { Soldier, Request } from '@/types';
import { Copy } from 'lucide-react';

export function NewRequest() {
  const { soldiers, addRequest, getSoldierById } = useData();
  const { toast } = useToast();
  
  const [selectedSoldierId, setSelectedSoldierId] = useState('');
  const [selectedReplacedSoldierId, setSelectedReplacedSoldierId] = useState('');
  const [requestType, setRequestType] = useState<'single-day' | 'multi-day' | 'replacement' | 'departure'>('single-day');
  const [formData, setFormData] = useState<any>({
    commanderName: '',
    arrivalDate: '',
    departureDate: '',
    baseName: '',
    wasInBaseBefore: false,
    requiresApproval: false,
    replacedSoldier: {
      departureDate: '',
    },
  });
  const [generatedMessage, setGeneratedMessage] = useState('');

  const selectedSoldier = selectedSoldierId ? getSoldierById(selectedSoldierId) : null;
  const selectedReplacedSoldier = selectedReplacedSoldierId ? getSoldierById(selectedReplacedSoldierId) : null;

  const generateMessage = () => {
    if (!selectedSoldier || !formData.commanderName) {
      toast({
        title: "שגיאה",
        description: "אנא בחר חייל ומלא את שם המפקד",
        variant: "destructive",
      });
      return;
    }

    if (requestType === 'replacement' && !selectedReplacedSoldier) {
      toast({
        title: "שגיאה",
        description: "אנא בחר את החייל היוצא עבור בקשת החלפה",
        variant: "destructive",
      });
      return;
    }

    let message = '';
    const currentDate = new Date().toLocaleDateString('he-IL');

    switch (requestType) {
      case 'single-day':
        message = `בקשה להצטרפות חד-יומית ללא לינה

תאריך: ${currentDate}
מפקד מבקש: ${formData.commanderName}

פרטי החייל:
שם: ${selectedSoldier.fullName}
מ.א.: ${selectedSoldier.personalNumber}
דרגה: ${selectedSoldier.rank}
תפקיד: ${selectedSoldier.position}
מדור: ${selectedSoldier.department}
${selectedSoldier.team ? `צוות: ${selectedSoldier.team}` : ''}

פרטי הבקשה:
תאריך הגעה: ${formData.arrivalDate}
שם הבסיס: ${formData.baseName}
${formData.wasInBaseBefore ? 'היה בבסיס בעבר: כן' : 'היה בבסיס בעבר: לא'}
${formData.requiresApproval ? 'נדרש אישור: כן' : 'נדרש אישור: לא'}
${selectedSoldier.requiresApproval ? 'נדרש אישור לירקוניר: כן' : 'נדרש אישור לירקוניר: לא'}
${selectedSoldier.hasIntelligenceWatch ? 'קיים משמר אמ"ן: כן' : 'קיים משמר אמ"ן: לא'}
${selectedSoldier.hasAllergy ? 'יש אלרגיה: כן' : 'יש אלרגיה: לא'}`;
        break;

      case 'multi-day':
        message = `בקשה להצטרפות עם לינה למספר ימים

תאריך: ${currentDate}
מפקד מבקש: ${formData.commanderName}

פרטי החייל:
שם: ${selectedSoldier.fullName}
מ.א.: ${selectedSoldier.personalNumber}
דרגה: ${selectedSoldier.rank}
תפקיד: ${selectedSoldier.position}
מדור: ${selectedSoldier.department}
${selectedSoldier.team ? `צוות: ${selectedSoldier.team}` : ''}

פרטי הבקשה:
תאריך הגעה: ${formData.arrivalDate}
תאריך עזיבה: ${formData.departureDate}
שם הבסיס: ${formData.baseName}
${formData.wasInBaseBefore ? 'היה בבסיס בעבר: כן' : 'היה בבסיס בעבר: לא'}
${formData.requiresApproval ? 'נדרש אישור: כן' : 'נדרש אישור: לא'}
${selectedSoldier.requiresApproval ? 'נדרש אישור לירקוניר: כן' : 'נדרש אישור לירקוניר: לא'}
${selectedSoldier.hasIntelligenceWatch ? 'קיים משמר אמ"ן: כן' : 'קיים משמר אמ"ן: לא'}
${selectedSoldier.hasAllergy ? 'יש אלרגיה: כן' : 'יש אלרגיה: לא'}`;
        break;

      case 'replacement':
        message = `בקשה להצטרפות עם לינה והחלפה של חייל אחר

תאריך: ${currentDate}
מפקד מבקש: ${formData.commanderName}

פרטי החייל הנכנס:
שם: ${selectedSoldier.fullName}
מ.א.: ${selectedSoldier.personalNumber}
דרגה: ${selectedSoldier.rank}
תפקיד: ${selectedSoldier.position}
מדור: ${selectedSoldier.department}
${selectedSoldier.team ? `צוות: ${selectedSoldier.team}` : ''}

פרטי החייל היוצא:
שם: ${selectedReplacedSoldier?.fullName}
מ.א.: ${selectedReplacedSoldier?.personalNumber}
דרגה: ${selectedReplacedSoldier?.rank}
תפקיד: ${selectedReplacedSoldier?.position}
תאריך עזיבה: ${formData.replacedSoldier.departureDate}

פרטי הבקשה:
תאריך הגעה: ${formData.arrivalDate}
תאריך עזיבה: ${formData.departureDate}
שם הבסיס: ${formData.baseName}
${formData.wasInBaseBefore ? 'היה בבסיס בעבר: כן' : 'היה בבסיס בעבר: לא'}
${formData.requiresApproval ? 'נדרש אישור: כן' : 'נדרש אישור: לא'}
${selectedSoldier.requiresApproval ? 'נדרש אישור לירקוניר: כן' : 'נדרש אישור לירקוניר: לא'}
${selectedSoldier.hasIntelligenceWatch ? 'קיים משמר אמ"ן: כן' : 'קיים משמר אמ"ן: לא'}
${selectedSoldier.hasAllergy ? 'יש אלרגיה: כן' : 'יש אלרגיה: לא'}`;
        break;

      case 'departure':
        message = `בקשה לעזיבת בסיס

תאריך: ${currentDate}
מפקד מבקש: ${formData.commanderName}

פרטי החייל:
שם: ${selectedSoldier.fullName}
מ.א.: ${selectedSoldier.personalNumber}
דרגה: ${selectedSoldier.rank}
תפקיד: ${selectedSoldier.position}
מדור: ${selectedSoldier.department}
${selectedSoldier.team ? `צוות: ${selectedSoldier.team}` : ''}

פרטי הבקשה:
שם הבסיס: ${formData.baseName}`;
        break;
    }

    setGeneratedMessage(message);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast({
      title: "הועתק בהצלחה",
      description: "ההודעה הועתקה ללוח",
    });
  };

  const saveRequest = () => {
    if (!selectedSoldier || !generatedMessage) {
      toast({
        title: "שגיאה",
        description: "אנא צור הודעה לפני השמירה",
        variant: "destructive",
      });
      return;
    }

    const baseRequest = {
      type: requestType,
      soldierId: selectedSoldierId,
      createdDate: new Date().toISOString(),
      commanderName: formData.commanderName,
      status: 'ממתינה' as const,
      message: generatedMessage,
    };

    let request: Omit<Request, 'id'>;

    if (requestType === 'replacement') {
      request = {
        ...baseRequest,
        arrivalDate: formData.arrivalDate,
        departureDate: formData.departureDate,
        requiresApproval: formData.requiresApproval,
        baseName: formData.baseName,
        wasInBaseBefore: formData.wasInBaseBefore,
        replacedSoldier: {
          fullName: selectedReplacedSoldier?.fullName || '',
          personalNumber: selectedReplacedSoldier?.personalNumber || '',
          rank: selectedReplacedSoldier?.rank || '',
          position: selectedReplacedSoldier?.position || '',
          departureDate: formData.replacedSoldier.departureDate,
        },
      };
    } else if (requestType === 'departure') {
      request = {
        ...baseRequest,
        baseName: formData.baseName,
      };
    } else {
      request = {
        ...baseRequest,
        arrivalDate: formData.arrivalDate,
        requiresApproval: formData.requiresApproval,
        baseName: formData.baseName,
        wasInBaseBefore: formData.wasInBaseBefore,
        ...(requestType === 'multi-day' && { departureDate: formData.departureDate }),
      };
    }

    addRequest(request);
    
    toast({
      title: "הצלחה",
      description: "הבקשה נשמרה בהצלחה",
    });

    // Reset form
    setSelectedSoldierId('');
    setSelectedReplacedSoldierId('');
    setFormData({
      commanderName: '',
      arrivalDate: '',
      departureDate: '',
      baseName: '',
      wasInBaseBefore: false,
      requiresApproval: false,
      replacedSoldier: {
        departureDate: '',
      },
    });
    setGeneratedMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">יצירת הודעה חדשה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="soldier">בחר חייל</Label>
              <Select value={selectedSoldierId} onValueChange={setSelectedSoldierId}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר חייל מהרשימה" />
                </SelectTrigger>
                <SelectContent>
                  {soldiers.map((soldier) => (
                    <SelectItem key={soldier.id} value={soldier.id}>
                      {soldier.fullName} - {soldier.personalNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="requestType">סוג בקשה</Label>
              <Select value={requestType} onValueChange={(value: any) => setRequestType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-day">הצטרפות חד-יומית ללא לינה</SelectItem>
                  <SelectItem value="multi-day">הצטרפות עם לינה למספר ימים</SelectItem>
                  <SelectItem value="replacement">הצטרפות עם לינה והחלפה</SelectItem>
                  <SelectItem value="departure">עזיבת בסיס</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="commanderName">שם המפקד</Label>
            <Input
              id="commanderName"
              value={formData.commanderName}
              onChange={(e) => setFormData({ ...formData, commanderName: e.target.value })}
              placeholder="הכנס שם המפקד"
            />
          </div>

          {/* Form fields based on request type */}
          {(requestType === 'single-day' || requestType === 'multi-day' || requestType === 'replacement') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="arrivalDate">תאריך הגעה</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                />
              </div>
              
              {(requestType === 'multi-day' || requestType === 'replacement') && (
                <div>
                  <Label htmlFor="departureDate">תאריך עזיבה</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="baseName">שם הבסיס</Label>
                <Input
                  id="baseName"
                  value={formData.baseName}
                  onChange={(e) => setFormData({ ...formData, baseName: e.target.value })}
                  placeholder="הכנס שם הבסיס"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasInBaseBefore"
                  checked={formData.wasInBaseBefore}
                  onCheckedChange={(checked) => setFormData({ ...formData, wasInBaseBefore: !!checked })}
                />
                <Label htmlFor="wasInBaseBefore">היה בבסיס בעבר</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresApproval"
                  checked={formData.requiresApproval}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: !!checked })}
                />
                <Label htmlFor="requiresApproval">נדרש אישור</Label>
              </div>
            </div>
          )}

          {requestType === 'replacement' && (
            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">פרטי החייל היוצא</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="replacedSoldier">בחר חייל יוצא</Label>
                  <Select value={selectedReplacedSoldierId} onValueChange={setSelectedReplacedSoldierId}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר חייל יוצא מהרשימה" />
                    </SelectTrigger>
                    <SelectContent>
                      {soldiers.map((soldier) => (
                        <SelectItem key={soldier.id} value={soldier.id}>
                          {soldier.fullName} - {soldier.personalNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="replacedSoldierDeparture">תאריך עזיבה</Label>
                  <Input
                    id="replacedSoldierDeparture"
                    type="date"
                    value={formData.replacedSoldier.departureDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      replacedSoldier: { ...formData.replacedSoldier, departureDate: e.target.value }
                    })}
                  />
                </div>
              </div>
            </Card>
          )}

          {requestType === 'departure' && (
            <div>
              <Label htmlFor="baseName">שם הבסיס</Label>
              <Input
                id="baseName"
                value={formData.baseName}
                onChange={(e) => setFormData({ ...formData, baseName: e.target.value })}
                placeholder="הכנס שם הבסיס"
              />
            </div>
          )}

          <Button
            onClick={generateMessage}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            צור הודעה
          </Button>
        </CardContent>
      </Card>

      {generatedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>הודעה שנוצרה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedMessage}
              onChange={(e) => setGeneratedMessage(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
            
            <div className="flex gap-4">
              <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                העתק ללוח
              </Button>
              
              <Button onClick={saveRequest} className="bg-green-600 hover:bg-green-700">
                שמור לבקשות
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
