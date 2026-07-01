import { OrderGuest } from '@shared/types/orders';

export class GuestService {
  static createGuest(name: string): OrderGuest {
    return {
      id: `g_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name
    };
  }

  static addGuest(guests: OrderGuest[], newGuest: OrderGuest): OrderGuest[] {
    return [...guests, newGuest];
  }

  static removeGuest(guests: OrderGuest[], guestId: string): OrderGuest[] {
    if (guests.length <= 1) {
      throw new Error('Нельзя удалить последнего гостя');
    }
    const updatedGuests = guests.filter(g => g.id !== guestId);
    if (updatedGuests.length === 0) {
      throw new Error('Нельзя удалить всех гостей');
    }
    return updatedGuests;
  }

  static generateGuestName(guests: OrderGuest[]): string {
    let maxNumber = 0;
    guests.forEach((guest) => {
      const match = guest.name.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });
    return `Гость ${maxNumber > 0 ? maxNumber + 1 : guests.length + 1}`;
  }

  static remapGuests(
    sourceGuests: OrderGuest[], 
    targetGuests: OrderGuest[]
  ): { remappedGuests: OrderGuest[]; guestIdMap: Record<string, string> } {
    const guestIdMap: Record<string, string> = {};
    const remappedGuests: OrderGuest[] = [];
    const targetCount = targetGuests.length;

    sourceGuests.forEach((guest, index) => {
      const newId = `g_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      guestIdMap[guest.id] = newId;
      remappedGuests.push({
        id: newId,
        name: `Гость ${targetCount + index + 1}`
      });
    });

    return { remappedGuests, guestIdMap };
  }

  static mergeGuests(targetGuests: OrderGuest[], sourceGuests: OrderGuest[]): OrderGuest[] {
    return [...targetGuests, ...sourceGuests];
  }
}