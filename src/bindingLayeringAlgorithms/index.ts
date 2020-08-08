import RandomLayering from "./RandomLayering";
import { BindingLayering } from "./types";

export const RANDOM_LAYERING = "RANDOM_LAYERING"
export const EXACT_LAYERING = "EXACT_LAYERING"
export const GREEDY_LAYERING = "GREEDY_LAYERING"

export const bindingAlgorithms: {[key: string]: new () => BindingLayering } = {
    [RANDOM_LAYERING]: RandomLayering,
}