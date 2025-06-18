
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/hooks/useData';
import { Soldier } from '@/types';

export function AddSoldier() {
  const { addSoldier } = useData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<Soldier, 'id'>>({
    fullName: '',
    personalNumber: '',
    idNumber: '',
    phone: '',
    gender: 'ז',
    rank: '',
    serviceType: 'סדיר',
    center: '',
    branch: '',
    department: '',
    team: '',
    position: '',
    requiresApproval: false,
    hasIntelligenceWatch: false,
    securityClearance: '',
    hasAllergy: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.personalNumber || !formData.idNumber) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }

    addSoldier(formData);
    
    toast({
      title: "הצלחה",
      description: "החייל נוסף בהצלחה למאגר",
    });

    // Reset form
    setFormData({
      fullName: '',
      personalNumber: '',
      idNumber: '',
      phone: '',
      gender: 'ז',
      rank: '',
      serviceType: 'סדיר',
      center: '',
      branch: '',
      department: '',
      team: '',
      position: '',
      requiresApproval: false,
      hasIntelligenceWatch: false,
      securityClearance: '',
      hasAllergy: false,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">הוספת חייל למאגר</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">שם מלא *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="personalNumber">מספר אישי (מ.א.) *</Label>
              <Input
                id="personalNumber"
                value={formData.personalNumber}
                onChange={(e) => setFormData({ ...formData, personalNumber: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="idNumber">ת"ז *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">טלפון נייד</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="gender">מגדר</Label>
              <Select value={formData.gender} onValueChange={(value: 'ז' | 'נ') => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ז">זכר</SelectItem>
                  <SelectItem value="נ">נקבה</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rank">דרגה</Label>
              <Input
                id="rank"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="serviceType">סוג שירות</Label>
              <Select value={formData.serviceType} onValueChange={(value: 'סדיר' | 'מיל' | 'יועץ') => setFormData({ ...formData, serviceType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="סדיר">סדיר</SelectItem>
                  <SelectItem value="מיל">מיל'</SelectItem>
                  <SelectItem value="יועץ">יועץ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="center">מרכז</Label>
              <Input
                id="center"
                value={formData.center}
                onChange={(e) => setFormData({ ...formData, center: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="branch">ענף</Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="department">מדור</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="team">צוות (אופציונלי)</Label>
              <Input
                id="team"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="position">תפקיד</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="securityClearance">סיווג בטחוני</Label>
              <Input
                id="securityClearance"
                value={formData.securityClearance}
                onChange={(e) => setFormData({ ...formData, securityClearance: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresApproval"
                checked={formData.requiresApproval}
                onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: !!checked })}
              />
              <Label htmlFor="requiresApproval">נדרש אישור לירקוניר</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasIntelligenceWatch"
                checked={formData.hasIntelligenceWatch}
                onCheckedChange={(checked) => setFormData({ ...formData, hasIntelligenceWatch: !!checked })}
              />
              <Label htmlFor="hasIntelligenceWatch">קיים משמר אמ"ן</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAllergy"
                checked={formData.hasAllergy}
                onCheckedChange={(checked) => setFormData({ ...formData, hasAllergy: !!checked })}
              />
              <Label htmlFor="hasAllergy">יש אלרגיה</Label>
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
            הוסף חייל למאגר
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
