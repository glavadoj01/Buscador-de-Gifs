import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { GifListComponent } from '@gifs/components/gif-list/gif-list.component';
import { GifService } from '@gifs/services/gifs.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gifs-history',
  imports: [GifListComponent],
  templateUrl: './gifs-history.component.html',
})
export default class GifsHistoryComponent {

  gifService = inject(GifService);
  route = inject(ActivatedRoute)

  query = toSignal(
    this.route.params.pipe(
      map( parametro => parametro['queryKey']
    ))
  )

  gifsByKey = computed( () => this.gifService.getHistoryGifs(this.query()))
}
