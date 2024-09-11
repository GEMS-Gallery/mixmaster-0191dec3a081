import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Drink {
  'id' : bigint,
  'name' : string,
  'description' : [] | [string],
  'price' : number,
  'ingredients' : Array<string>,
}
export interface _SERVICE {
  'getBartenderStatus' : ActorMethod<[], string>,
  'getDrinkMenu' : ActorMethod<[], Array<Drink>>,
  'orderDrink' : ActorMethod<[bigint], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
