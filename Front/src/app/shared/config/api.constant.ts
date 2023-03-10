import { environment } from 'src/environments/environment';

export const TIMEOUT = 3000;

export class RequestEndpoints {
  static USERS = environment.API_URL + '/users';
  static MOVE = environment.API_URL + '/movement';
  static MOVES = environment.API_URL + '/movements';
  static MOM = environment.API_URL + '/month/movesOfMonth';
  static SALDO = environment.API_URL + '/saldo';
}
