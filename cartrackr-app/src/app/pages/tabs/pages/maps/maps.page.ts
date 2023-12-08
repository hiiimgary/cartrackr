import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import * as Leaflet from 'leaflet';
import { Store } from '@ngrx/store';
import { MapsActions } from './store/maps.actions';
import { selectLocations } from './store/maps.selectors';
import { Subject, takeUntil, tap } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [...IONIC_COMPONENTS, CommonModule, FormsModule],
})
export class MapsPage implements AfterViewInit, OnInit, OnDestroy {
  private map!: Leaflet.Map;

  @ViewChild('map') mapContainer!: ElementRef<HTMLElement>;

  locations$ = this.store.select(selectLocations);

  destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    });
  }

  ngOnInit(): void {
    console.log('asd');

    this.store.dispatch(MapsActions.fetchLocations());
  }

  ngOnDestroy(): void {}

  private initMap(): void {
    this.map = Leaflet.map(this.mapContainer.nativeElement, {
      center: [47.4979, 19.0407],
      zoom: 14,
      attributionControl: false,
      zoomControl: false,
    });

    const tiles = Leaflet.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 24,
        minZoom: 4,
        detectRetina: true,
      },
    );

    tiles.addTo(this.map);

    this.getLocation().then((location) => {
      this.map.setView([location.lat, location.lng], 14);
      Leaflet.marker(location, {
        icon: Leaflet.icon({
          iconUrl: `assets/icon/user.svg`,
        }),
      }).addTo(this.map);
    });

    this.locations$.pipe(takeUntil(this.destroy$)).subscribe((locations) => {
      locations.forEach((location) => {
        if (location.latitude === '' || location.longitude === '') {
          return;
        }

        Leaflet.marker(
          {
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude),
          },
          {
            icon: Leaflet.icon({
              iconUrl: `assets/icon/${
                location.business ? 'service' : 'fuel-station'
              }.svg`,
            }),
          },
        ).addTo(this.map);
      });
    });
  }

  private getLocation(): Promise<{ lat: number; lng: number }> {
    return Geolocation.requestPermissions()
      .then((res) => {
        return Geolocation.getCurrentPosition();
      })
      .then((res) => {
        return {
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        };
      });
  }
}
