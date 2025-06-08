import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from '@gifs/components/gif-list/gif-list.component';
import { Gif } from '@gifs/interfaces/Gif.interface';
import { GifService } from '@gifs/services/gifs.service';

@Component({
  selector: 'search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  gifService = inject( GifService );
  gifs = signal<Gif[]>([]);

  searchGifs( query: string ) {
    this.gifService.loadSearchGifs( query ).subscribe({
      next: ( response ) => {
        this.gifs.set(response);
      },
      error: ( error ) => {
        console.error('Error fetching search GIFs:', error);
      }
    });
  }

}
