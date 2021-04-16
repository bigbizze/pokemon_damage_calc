import { RawDesc } from "@smogon/calc/dist/desc";

export type Some<T> = T | undefined | void;

export type PokemonRequest = {
    name: string;
    ability?: string;
    item?: string;
    nature?: string;
    evs?: StatKind;
    moves?: string[];
    curHP?: number;
    ivs?: StatKind;
    boosts?: StatKind;
};

export interface DamageCalcRequest {
    attacker: PokemonRequest,
    defender: Some<PokemonRequest>,
    move_name: string
}

export type Damage = number[];

export interface PokemonRes {
    damage: number;
    desc: RawDesc;
}

export type PokemonCalc = Omit<PokemonRequest, "name">;

export type StatKind = {
    hp?: number,
    atk?: number,
    def?: number,
    spa?: number,
    spd?: number,
    spe?: number
};
