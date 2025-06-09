import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifService } from '@gifs/services/gifs.service';
import { ScrollStateService } from '@shared/services/scroll-state.service';


@Component({
  selector: 'trending-page',
  imports: [],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit{

  gifService = inject( GifService );
  scrollStateService = inject( ScrollStateService );

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv')

  ngAfterViewInit() {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(eventIn: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollDiv;
    /* Equivale a:
    const scrollTop = scrollDiv.scrollTop;
    const scrollHeight = scrollDiv.scrollHeight;
    const clientHeight = scrollDiv.clientHeight;
    */

    this.scrollStateService.trendingScrollState.set(scrollTop);

    if (scrollTop + clientHeight + 200 >= scrollHeight) {
      this.gifService.loadTrendingGifs();
    }
  }

}
