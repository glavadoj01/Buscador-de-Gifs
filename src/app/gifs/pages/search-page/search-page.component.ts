import { Component, inject } from '@angular/core';
import { GifListComponent } from '@gifs/components/gif-list/gif-list.component';
import { GifService } from '@gifs/services/gifs.service';

@Component({
  selector: 'search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  searchGifs( query: string ) {
    console.log({query});
  }

  gifService = inject( GifService );

}
