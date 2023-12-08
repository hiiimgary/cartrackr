import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, IonicStorageModule],
})
export class StorageModule {
  static forRoot(config: { storageName: string }): ModuleWithProviders<StorageModule> {
    return {
      ngModule: StorageModule,
      providers: [
        ...IonicStorageModule.forRoot({
          name: config.storageName,
          driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage],
        }).providers!,
        StorageService,
      ],
    };
  }
}
