import { GrabMapOptions } from './GrabMap.interface'
import './style/GrabMap.css'
const TILE_SIZE = 256;
export class GrabMap {
  public container: HTMLElement;
  private _zoom: number;
  private _center: Lnglat;
  constructor (container: HTMLElement, options: GrabMapOptions) {
    this.container = container;
    this._initContainer();
    this.zoom = options.zoom;
    this.center = options.center;
    this._initEvent();
    this._rerender();
  }
  public set center (center: Lnglat) {
    this._center = center;
  };
  public get center () {
    return this._center;
  }

  public set zoom (zoom: number) {
    this._zoom = zoom;
  };
  public get zoom () {
    return this._zoom;
  }
  public getContainer () {
    return this.container;
  }
  private _rerender () {
    new Tiles(this);
  }
  private _initEvent () {
    console.log('initEvent');
    this.container.addEventListener('mousedown', evt => {
      console.log(evt.type);
    });
    this.container.addEventListener('mouseup', evt => {
      console.log(evt.type);
    });

    this.container.addEventListener('dblclick', evt => {
      this.zoom > 21 ? null : this.zoom += 1;
      console.log(evt.type);

    });

    this.container.addEventListener('click', evt => {
      console.log('click');
    })
  }
  private _initContainer (){
    const container = this.container;
    container.innerHTML = null;
    container.style.overflow = 'hidden'
  }
}

export class Lnglat {
  public lng:number;
  public lat: number;
  constructor (lng: number, lat: number) {
    this.lng = lng;
    this.lat = lat;
  }
}

export class Tiles {
  private _container: HTMLElement;
  private _map: GrabMap;
  constructor (map: GrabMap) {
    this._container = document.createElement('div');
    this._container.style.position = 'relative';
    this._container.style.overflow = 'visible'
    // map.container.appendChild(this._container)
    this._map = map;
    this._renderImgContainer();

  }
  private _renderImgContainer (){
    const col = Math.ceil(this._map.container.clientWidth / TILE_SIZE);
    const row = Math.ceil(this._map.container.clientHeight / TILE_SIZE);
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++){
        const img = document.createElement('div');
        // img.width = TILE_SIZE;
        // img.height = TILE_SIZE;
        img.style.width = `${TILE_SIZE}px`;
        img.style.height = `${TILE_SIZE}px`
        img.id = 'grab-map-img'
        img.style.lineHeight = `${TILE_SIZE}px`
        img.innerText = `${i}, ${j}`
        img.style.top = `${i * TILE_SIZE}px`;
        img.style.left = `${j * TILE_SIZE}px`;
        this._container.appendChild(img);
      }
    }
    this._map.getContainer().appendChild(this._container);
  }
}