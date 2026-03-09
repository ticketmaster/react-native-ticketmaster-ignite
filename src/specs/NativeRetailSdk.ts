import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  presentPrePurchaseAttraction(attractionId: string): void;
  presentPrePurchaseVenue(venueId: string): void;
  presentPurchase(eventId: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeRetailSdk');
