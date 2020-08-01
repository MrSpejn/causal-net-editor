import DotLayout from "./DotLayout";
import NeatoLayout from "./NeatoLayout";
import SugiyamaLayout from "./SugiyamaLayout";
import { GraphLayout } from "./types";

const SugiyamaLayoutName = "SUGIYAMA_LAYOUT"
const NeatoLayoutName = "NEATO_LAYOUT"
const DotLayoutName = "DOT_LAYOUT"

export const layouts: {[key: string]: new () => GraphLayout} = {
    [SugiyamaLayoutName]: SugiyamaLayout,
    [NeatoLayoutName]: NeatoLayout,
    [DotLayoutName]: DotLayout,
}