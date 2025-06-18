import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/hooks/useData';
import { Soldier, Request, SingleDayRequest, MultiDayRequest, ReplacementRequest, DepartureRequest } from '@/types';
import { generateMessage } from '@/utils';

export function NewRequest() {
  const { soldiers, addRequest, getSoldierById } = useData();
  const { toast } = useToast();

  const [requestType, setRequestType] = useState<'single-day' | 'multi-day' | 'replacement' | 'departure'>('single-day');
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);
  const [commanderName, setCommanderName] = useState('');
  const [arrivalDate, setArrivalDate] = useState<string | undefined>('');
  const [departureDate, setDepartureDate] = useState<string | undefined>('');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [baseName, setBaseName] = useState('');
  const [wasInBaseBefore, setWasInBaseBefore] = useState(false);
  const [replacedSoldierId, setReplacedSoldierId] = useState('');
  const [replacedSoldierDepartureDate, setReplacedSoldierDepartureDate] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');

  const handleSubmit = () => {
    if (!selectedSoldier) {
      toast({
        title: "שגיאה",
        description: "יש לבחור חייל",
        variant: "destructive",
      });
      return;
    }

    if (!commanderName.trim()) {
      toast({
        title: "שגיאה", 
        description: "יש למלא שם מפקד",
        variant: "destructive",
      });
      return;
    }

    const baseRequestData = {
      type: requestType as any,
      soldierId: selectedSoldier.id,
      createdDate: new Date().toISOString(),
      commanderName: commanderName.trim(),
      status: 'ממתינה' as const,
      message: '',
    };

    let requestData: Omit<Request, 'id'>;

    if (requestType === 'single-day') {
      if (!arrivalDate || !baseName.trim()) {
        toast({
          title: "שגיאה",
          description: "יש למלא את כל השדות הנדרשים",
          variant: "destructive",
        });
        return;
      }

      requestData = {
        ...baseRequestData,
        type: 'single-day',
        arrivalDate,
        requiresApproval,
        baseName: baseName.trim(),
        wasInBaseBefore,
      } as Omit<SingleDayRequest, 'id'>;

    } else if (requestType === 'multi-day') {
      if (!arrivalDate || !departureDate || !baseName.trim()) {
        toast({
          title: "שגיאה",
          description: "יש למלא את כל השדות הנדרשים",
          variant: "destructive",
        });
        return;
      }

      requestData = {
        ...baseRequestData,
        type: 'multi-day',
        arrivalDate,
        departureDate,
        requiresApproval,
        baseName: baseName.trim(),
        wasInBaseBefore,
      } as Omit<MultiDayRequest, 'id'>;

    } else if (requestType === 'replacement') {
      if (!arrivalDate || !departureDate || !baseName.trim() || !replacedSoldierId || !replacedSoldierDepartureDate) {
        toast({
          title: "שגיאה",
          description: "יש למלא את כל השדות הנדרשים",
          variant: "destructive",
        });
        return;
      }

      const replacedSoldier = getSoldierById(replacedSoldierId);
      if (!replacedSoldier) {
        toast({
          title: "שגיאה",
          description: "חייל מוחלף לא נמצא",
          variant: "destructive",
        });
        return;
      }

      requestData = {
        ...baseRequestData,
        type: 'replacement',
        arrivalDate,
        departureDate,
        requiresApproval,
        baseName: baseName.trim(),
        wasInBaseBefore,
        replacedSoldier: {
          fullName: replacedSoldier.fullName,
          personalNumber: replacedSoldier.personalNumber,
          rank: replacedSoldier.rank,
          position: replacedSoldier.position,
          departureDate: replacedSoldierDepartureDate,
        },
      } as Omit<ReplacementRequest, 'id'>;

    } else if (requestType === 'departure') {
      if (!baseName.trim()) {
        toast({
          title: "שגיאה",
          description: "יש למלא שם בסיס",
          variant: "destructive",
        });
        return;
      }

      requestData = {
        ...baseRequestData,
        type: 'departure',
        baseName: baseName.trim(),
      } as Omit<DepartureRequest, 'id'>;
    } else {
      return;
    }

    const message = generateMessage(requestData, selectedSoldier);
    requestData.message = message;
    setGeneratedMessage(message);

    addRequest(requestData);

    toast({
      title: "בקשה נוצרה בהצלחה",
      description: "הבקשה נשמרה במערכת",
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">יצירת בקשה חדשה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="soldier">חייל</Label>
            <Select onValueChange={(value) => setSelectedSoldier(soldiers.find(soldier => soldier.id === value) || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר חייל" />
              </SelectTrigger>
              <SelectContent>
                {soldiers.map((soldier) => (
                  <SelectItem key={soldier.id} value={soldier.id}>{soldier.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="requestType">סוג בקשה</Label>
            <Select onValueChange={(value) => setRequestType(value as 'single-day' | 'multi-day' | 'replacement' | 'departure')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר סוג בקשה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-day">הצטרפות חד-יומית</SelectItem>
                <SelectItem value="multi-day">הצטרפות עם לינה</SelectItem>
                <SelectItem value="replacement">הצטרפות והחלפה</SelectItem>
                <SelectItem value="departure">עזיבת בסיס</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="commanderName">שם מפקד</Label>
            <Input
              id="commanderName"
              type="text"
              value={commanderName}
              onChange={(e) => setCommanderName(e.target.value)}
            />
          </div>

          {requestType !== 'departure' && (
            <>
              <div>
                <Label>תאריך הגעה</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !arrivalDate && "text-muted-foreground"
                      )}
                    >
                      {arrivalDate ? (
                        new Date(arrivalDate).toLocaleDateString("he-IL")
                      ) : (
                        <span>בחר תאריך</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={arrivalDate ? new Date(arrivalDate) : undefined}
                      onSelect={(date) => setArrivalDate(date?.toISOString())}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {(requestType === 'multi-day' || requestType === 'replacement') && (
                <div>
                  <Label>תאריך עזיבה</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !departureDate && "text-muted-foreground"
                        )}
                      >
                        {departureDate ? (
                          new Date(departureDate).toLocaleDateString("he-IL")
                        ) : (
                          <span>בחר תאריך</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={departureDate ? new Date(departureDate) : undefined}
                        onSelect={(date) => setDepartureDate(date?.toISOString())}
                        disabled={(date) =>
                          date < new Date(arrivalDate || '')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {requestType === 'replacement' && (
                <>
                  <div>
                    <Label htmlFor="replacedSoldier">חייל מוחלף</Label>
                    <Select onValueChange={setReplacedSoldierId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="בחר חייל מוחלף" />
                      </SelectTrigger>
                      <SelectContent>
                        {soldiers.map((soldier) => (
                          <SelectItem key={soldier.id} value={soldier.id}>{soldier.fullName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>תאריך עזיבה של חייל מוחלף</Label>
                    <Input
                      type="date"
                      value={replacedSoldierDepartureDate}
                      onChange={(e) => setReplacedSoldierDepartureDate(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="baseName">שם בסיס</Label>
                <Input
                  id="baseName"
                  type="text"
                  value={baseName}
                  onChange={(e) => setBaseName(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasInBaseBefore"
                  checked={wasInBaseBefore}
                  onCheckedChange={(checked) => setWasInBaseBefore(checked === true)}
                />
                <Label htmlFor="wasInBaseBefore">היה בבסיס בעבר?</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresApproval"
                  checked={requiresApproval}
                  onCheckedChange={(checked) => setRequiresApproval(checked === true)}
                />
                <Label htmlFor="requiresApproval">דורש אישור?</Label>
              </div>
            </>
          )}

          {requestType === 'departure' && (
            <div>
              <Label htmlFor="baseName">שם בסיס</Label>
              <Input
                id="baseName"
                type="text"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleSubmit}>צור בקשה</Button>

          {generatedMessage && (
            <div className="mt-4">
              <Label>הודעה שנוצרה:</Label>
              <Textarea value={generatedMessage} readOnly className="mt-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
