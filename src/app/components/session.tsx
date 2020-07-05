import React from "react";
import { FunctionComponent } from "react";
import { GameSession } from "../../system/db/types";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  List,
  ListItem,
  createStyles,
  makeStyles,
  ListItemText,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import moment from "moment";
import { useHistory } from "react-router-dom";

type Props = {
  session: GameSession;
  expanded: boolean;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    expansionDetails: {
      flex: 1,
      flexDirection: "column",
      display: "flex",
    },
  }),
);

export const Session: FunctionComponent<Props> = (props: Props) => {
  const { session, expanded } = props;
  const history = useHistory();
  const classes = useStyles();
  return (
    <ExpansionPanel key={session.from} defaultExpanded={expanded}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          {moment(session.from * 1000).format("ddd YYYY-MM-DD HH:mm")}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionDetails}>
        <List component="nav" aria-label="secondary mailbox folders">
          {session.replays.map((r) => {
            const itemText = `${moment(r.gameDate * 1000).format("HH:mm")} ${
              r.win ? "Win" : "Loss"
            }`;
            return (
              <ListItem
                key={r.fileName}
                button
                onClick={() =>
                  history.push({
                    pathname: `/ViewGame/${r.fileName}`,
                  })
                }
              >
                <ListItemText primary={itemText} />
              </ListItem>
            );
          })}
        </List>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
