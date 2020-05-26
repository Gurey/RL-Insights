import React from "react";

import { Check, Block } from "@material-ui/icons";
import { green, red } from "@material-ui/core/colors";

export const renderCheckListIcon = (ok: boolean) => {
  return ok ? (
    <Check style={{ color: green[500] }} alignmentBaseline="baseline" />
  ) : (
    <Block style={{ color: red[500] }} alignmentBaseline="baseline" />
  );
};
