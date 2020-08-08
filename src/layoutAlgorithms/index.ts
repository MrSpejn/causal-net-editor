import DotLayout from "./DotLayout";
import NeatoLayout from "./NeatoLayout";
// import SugiyamaLayout from "./SugiyamaLayout";
import { GraphLayout, ConstructParams } from "./types";

export const SUGIYAMA_LAYOUT = "SUGIYAMA_LAYOUT"
export const NEATO_LAYOUT = "NEATO_LAYOUT"
export const DOT_LAYOUT = "DOT_LAYOUT"

export const layouts: {[key: string]: new (p: ConstructParams) => GraphLayout} = {
    // [SUGIYAMA_LAYOUT]: SugiyamaLayout,
    [NEATO_LAYOUT]: NeatoLayout,
    [DOT_LAYOUT]: DotLayout,
}