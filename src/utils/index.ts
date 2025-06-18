
import { Soldier, Request } from '@/types';

export function generateMessage(requestData: Omit<Request, 'id'>, soldier: Soldier): string {
  const { type, commanderName } = requestData;
  
  const soldierDetails = `${soldier.rank} ${soldier.fullName} (מ.א. ${soldier.personalNumber})`;
  
  switch (type) {
    case 'single-day':
      const singleDayData = requestData as any;
      return `בקשה להצטרפות חד-יומית ללא לינה
חייל: ${soldierDetails}
תאריך הגעה: ${new Date(singleDayData.arrivalDate).toLocaleDateString('he-IL')}
בסיס: ${singleDayData.baseName}
היה בבסיס בעבר: ${singleDayData.wasInBaseBefore ? 'כן' : 'לא'}
דורש אישור: ${singleDayData.requiresApproval ? 'כן' : 'לא'}
מפקד מבקש: ${commanderName}`;

    case 'multi-day':
      const multiDayData = requestData as any;
      return `בקשה להצטרפות עם לינה
חייל: ${soldierDetails}
תאריך הגעה: ${new Date(multiDayData.arrivalDate).toLocaleDateString('he-IL')}
תאריך עזיבה: ${new Date(multiDayData.departureDate).toLocaleDateString('he-IL')}
בסיס: ${multiDayData.baseName}
היה בבסיס בעבר: ${multiDayData.wasInBaseBefore ? 'כן' : 'לא'}
דורש אישור: ${multiDayData.requiresApproval ? 'כן' : 'לא'}
מפקד מבקש: ${commanderName}`;

    case 'replacement':
      const replacementData = requestData as any;
      return `בקשה להצטרפות עם החלפה
חייל נכנס: ${soldierDetails}
תאריך הגעה: ${new Date(replacementData.arrivalDate).toLocaleDateString('he-IL')}
תאריך עזיבה: ${new Date(replacementData.departureDate).toLocaleDateString('he-IL')}
חייל יוצא: ${replacementData.replacedSoldier.rank} ${replacementData.replacedSoldier.fullName} (מ.א. ${replacementData.replacedSoldier.personalNumber})
תאריך עזיבת חייל יוצא: ${new Date(replacementData.replacedSoldier.departureDate).toLocaleDateString('he-IL')}
בסיס: ${replacementData.baseName}
היה בבסיס בעבר: ${replacementData.wasInBaseBefore ? 'כן' : 'לא'}
דורש אישור: ${replacementData.requiresApproval ? 'כן' : 'לא'}
מפקד מבקש: ${commanderName}`;

    case 'departure':
      const departureData = requestData as any;
      return `בקשה לעזיבת בסיס
חייל: ${soldierDetails}
בסיס: ${departureData.baseName}
מפקד מבקש: ${commanderName}`;

    default:
      return '';
  }
}
