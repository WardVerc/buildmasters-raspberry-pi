export interface StatsType {
  ip: string;
  cpu: string;
  memUsage: string;
  diskSpace: string;
  temp: string;
}

export interface PictureViewerType {
  pictureNames: Record<string, string[]>;
}

export interface PictureTakerType {
  getPictures: () => Promise<void>;
}