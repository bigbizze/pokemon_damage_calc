import { calculate, Generations, Move, Pokemon } from '@smogon/calc';
import { DamageCalcRequest, PokemonCalc, PokemonRequest, PokemonRes } from "./types";
import { Generation } from "@smogon/calc/dist/data/interface";

export const get_pokemon_fn = (gen: Generation) => (mon: PokemonRequest): Pokemon => {
    let name = mon.name;
    delete mon.name;
    return new Pokemon(gen, name, mon as PokemonCalc);
};

const gen = Generations.get(8);
const get_pokemon = get_pokemon_fn(gen);

const default_chansey = new Pokemon(gen, 'Chansey', {
    item: 'Eviolite',
    nature: 'Bold',
    evs: { hp: 252, def: 252, spd: 4 }
});

const sum = (vals: number[]): number =>
    vals.reduce((a, b) => a + b);

const avg = (vals: number[]): number =>
    sum(vals) / vals.length;

export const do_calc = (req: DamageCalcRequest): PokemonRes | string => {
    const move = new Move(gen, req.move_name);
    if (move.category === "Status") {
        return "Status moves are not allowed!";
    }

    // If nature isn't provided in input, assume + offense ones depending on the move used.
    const nature = req.attacker.nature != null ? req.attacker.nature : move.category === "Special" ? "Modest" : "Adamant";
    // Do the equivalent process for EVs
    const attacker_add = {
        nature,
        evs: {
            atk: req.attacker.evs?.atk != null ? req.attacker.evs.atk : 252,
            def: req.attacker.evs?.def != null ? req.attacker.evs.atk : 252,
            spa: req.attacker.evs?.spa != null ? req.attacker.evs.atk : 252,
            spe: move.name !== "Gyro Ball" ? 252 : 0
        }
    };
    const defender = req.defender ? get_pokemon(req.defender) : default_chansey;

    const attacker = get_pokemon({
        ...req.attacker,
        ...attacker_add
    });
    const calc_result = calculate(
        gen,
        attacker,
        defender,
        move
    );

    // Assume that damage returned is actually a 1d array of numbers (because it's sufficient for the scope of the project)
    const damage = calc_result.damage as unknown as number[];
    const perc_dmg = avg(damage) / defender.originalCurHP;
    return {
        damage: perc_dmg,
        desc: calc_result.rawDesc
    };
};
