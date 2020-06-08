import React, { useEffect } from "react";
import { useReplays } from "../../store/replays";
import {
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";
import { ExpandMore } from "@material-ui/icons";
import moment from "moment";

const useStyles = makeStyles((theme) =>
  createStyles({
    expansionDetails: {
      flex: 1,
      flexDirection: "column",
      display: "flex",
    },
  }),
);

type Props = RouteComponentProps;

export default function Sessions(props: Props) {
  const [state, actions] = useReplays();
  const classes = useStyles();
  useEffect(() => {
    actions.loadGameSessions("RANKED_STANDARD");
  }, [state.lastImportTime]);
  if (state.replayJsons.length < 0) {
    return <CircularProgress />;
  }
  return (
    <div>
      <Typography variant="h4">Sessions</Typography>
      {state.sessions.map((sess, index) => {
        console.log(sess.from);
        return (
          <ExpansionPanel key={sess.from} defaultExpanded={index === 0}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                {moment(sess.from * 1000).format("ddd YYYY-MM-DD HH:mm")}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionDetails}>
              <List component="nav" aria-label="secondary mailbox folders">
                {sess.replays.map((r) => {
                  const itemText = `${moment(r.gameDate * 1000).format(
                    "HH:mm",
                  )} ${r.win ? "Win" : "Loss"}`;
                  return (
                    <ListItem
                      key={r.fileName}
                      button
                      onClick={() =>
                        props.history.push({
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
      })}
    </div>
  );
}
