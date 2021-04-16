import { PokemonRequest, Some } from "./types";
import { concat_entries, reduce_objs } from "./fn";

const valid_stat_types = [ 'hp', 'atk', 'def', 'spa', 'spd', 'spe' ];

export const check_req_input = (body?: PokemonRequest, optional = false): Some<PokemonRequest | string> => {
    // Validate fields of request body
    if (!body) {
        return !optional ? "Bad Request!" : undefined;
    }
    const invalid_stats = reduce_objs<PokemonRequest, "ivs">(
        (acc, next) => concat_entries<PokemonRequest, "ivs">(next, acc),
        body.boosts,
        body.ivs,
        body.evs
    ).some(x => !valid_stat_types.includes(x[0]) || typeof x[1] !== "number");
    let invalid_inputs = [
        body.name == null && "You didn't provide a name!",
        invalid_stats && "incorrect boost, ivs or evs!"
    ].filter(Boolean);
    if (invalid_inputs.length !== 0) {
        return invalid_inputs.join("\n");
    }
    return body;
};
