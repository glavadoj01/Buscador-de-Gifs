import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GifMapper } from '@gifs/components/mapper/gif.mapper';
import { Gif } from '@gifs/interfaces/Gif.interface';
import { GiphyResponse } from '@gifs/interfaces/giphy.interfaces';

@Injectable({providedIn: 'root'})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([])
  trendingGifsLoading = signal<boolean>(true);

  searchGifs = signal<Gif[]>([])
  searchGifsLoading = signal<boolean>(true);

  constructor() {
    this.loadTrendingGifs();
    console.log('GifService creado por primera vez 👌');
  }

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '20',
        rating: 'g'
      }
    }).subscribe({
      next: (respuesta) => {
        const gifs = GifMapper.mapGiphyResponseToGifsArray(respuesta.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching trending GIFs:', error);
      }
    })

  }

  loadSearchGifs(query: string) {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/search`, {
      params:{
        api_key: environment.giphyApiKey,
        q: query,
        limit: '20',
        offset: '0',
        rating: 'g',
        lang: 'es',
        bundle: 'messaging_non_clips'
      }
    }).subscribe({
      next: (respuesta) => {
        const gifs = GifMapper.mapGiphyResponseToGifsArray(respuesta.data);
        this.searchGifs.set(gifs);
        this.searchGifsLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching search GIFs:', error);
      }
    })

  }
}
