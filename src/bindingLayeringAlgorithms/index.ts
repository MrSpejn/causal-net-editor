import RandomLayering from "./RandomLayering";
import { BindingLayering } from "./types";

const RandomLayeringName = "RANDOM_LAYERING"

export const bindingAlgorithms: {[key: string]: new () => BindingLayering } = {
    [RandomLayeringName]: RandomLayering,
}