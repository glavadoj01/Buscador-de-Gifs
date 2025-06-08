import { Gif } from "@gifs/interfaces/Gif.interface";
import { GyphyItem } from "@gifs/interfaces/giphy.interfaces";


export class GifMapper {
  static mapGiphyItemToGif(elementoEntrada: GyphyItem): Gif {
    return {
      id: elementoEntrada.id,
      title: elementoEntrada.title,
      url: elementoEntrada.images.original.url,
    };
  }

  static mapGiphyResponseToGifsArray(respuesta: GyphyItem[]): Gif[] {
    return respuesta.map(this.mapGiphyItemToGif);
  }
}
