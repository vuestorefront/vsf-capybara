declare module 'vue-croppie' {
  import Vue, { PluginObject } from 'vue';
  const VueCroppie: PluginObject<never>;
  export default VueCroppie;

  export class VueCroppieComponent extends Vue {
    public get(): currentState;

    public bind(options: {
      url: string,
      points?: number[],
      orientation?: number,
      zoom?: number,
      enforceBoundary?: boolean,
      minZoom?: number
    }): Promise<any>;

    public result(options: resultOptions, callback?: Function): Promise<string>;

    public setZoom(value: number): void;
  }

  export interface currentState {
    points: number[],
    orientation?: number,
    zoom: number
  }

  export interface resultOptions {
    type?: string,
    size?: string | { width: number, height: number },
    format?: string,
    quality?: number,
    circle?: boolean
  }
}
