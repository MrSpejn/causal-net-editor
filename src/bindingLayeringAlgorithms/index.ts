import RandomLayering from "./RandomLayering";
import { BindingLayering } from "./types";
import GreedyLayering from "./GreedyLayering";
import VariantSearchLayering from "./VariantSearchLayering";
import AdvancedVariantSearchLayering from "./AdvancedVariantSearchLayering";

export const RANDOM_LAYERING = "RANDOM_LAYERING";
export const VARIANT_SEARCH_LAYERING = "VARIANT_SEARCH_LAYERING";
export const GREEDY_LAYERING = "GREEDY_LAYERING";
export const ADVANCED_VARIANT_SEARCH_LAYERING = "ADVANCED_VARIANT_SEARCH_LAYERING"

export const bindingAlgorithms: {[key: string]: new () => BindingLayering } = {
    [RANDOM_LAYERING]: RandomLayering,
    [GREEDY_LAYERING]: GreedyLayering,
    [VARIANT_SEARCH_LAYERING]: VariantSearchLayering,
    [ADVANCED_VARIANT_SEARCH_LAYERING]: AdvancedVariantSearchLayering,
}