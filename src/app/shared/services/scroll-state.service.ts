import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ScrollStateService {

  trendingScrollState = signal<number>(0)



}
