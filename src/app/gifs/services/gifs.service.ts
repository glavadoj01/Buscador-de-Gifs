// @Angular
import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

// @3ª Party
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// @Local
import { environment } from '@environments/environment';
import { GifMapper } from '@gifs/components/mapper/gif.mapper';
import { Gif } from '@gifs/interfaces/Gif.interface';
import type { GiphyResponse } from '@gifs/interfaces/giphy.interfaces';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifsParsed = JSON.parse(gifsFromLocalStorage);
  return gifsParsed as Record<string, Gif[]>;
}


@Injectable({providedIn: 'root'})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([])
  trendingGifsIsLoading = signal<boolean>(false);
  private trendingPage = signal<number>(0);

  trendingGifGroup = computed<Gif[][]>( () => {
    const group = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      group.push(this.trendingGifs().slice(i, i + 3));
    }
    return group
  })

  searchHistory = signal<Record<string, Gif[]>> (loadFromLocalStorage());
  searchHistoryKeys= computed(() => Object.keys(this.searchHistory()));


  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect( () => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  })

  loadTrendingGifs() {
    // Evitar que se haga una peticion si ya se esta cargando
    if (this.trendingGifsIsLoading()) return;
    this.trendingGifsIsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 24,
        rating: 'g',
        offset: this.trendingPage() * 20,
      }
    }).subscribe({
      next: respuesta => {
        const gifs = GifMapper.mapGiphyResponseToGifsArray(respuesta.data);
        this.trendingGifs.update( currentGifs =>
          [...currentGifs, ...gifs]
        );
        this.trendingGifsIsLoading.set(false);
        this.trendingPage.update( currentPage => currentPage + 1 );
      },
      error: error => {
        console.error('Error fetching trending GIFs:', error);
      }
    })

  }

  loadSearchGifs(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/search`, {
      params:{
        api_key: environment.giphyApiKey,
        q: query,
        limit: 24,
        offset: 0,
        rating: 'g',
        lang: 'es',
        bundle: 'messaging_non_clips'
      }
    }).pipe(
      map( ({ data }) => data),
      map( itemData => GifMapper.mapGiphyResponseToGifsArray(itemData)),

      // Añadir Historial al de busquedas WIP
      tap ( itemGif => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()]: itemGif,
        }))
      })
    )
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? []
  }
}
/*
El doble map es a titulo demostrativo => se pueden encadenar varios operadores en un pipe
Seria equivalente a:

}).pipe(
  map( ({ data }) => GifMapper.mapGiphyResponseToGifsArray(data))
)

*/
