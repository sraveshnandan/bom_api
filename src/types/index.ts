// JWT decodedtoken interface
export interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export interface UploadResult {
  public_id: string;
  url: string;
}
