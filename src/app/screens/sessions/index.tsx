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
import { Session } from "../../components/session";

const useStyles = makeStyles((theme) => createStyles({}));

type Props = RouteComponentProps;

export default function Sessions(props: Props) {
  const [state, actions] = useReplays();
  useEffect(() => {
    actions.loadGameSessions("RANKED_STANDARD");
  }, [state.lastImportTime]);
  if (state.replayJsons.length < 0) {
    return <CircularProgress />;
  }
  return (
    <div>
      <Typography variant="h4">Sessions</Typography>
      {state.sessions.map((sess, index) => (
        <Session key={sess.from} session={sess} expanded={index === 0} />
      ))}
    </div>
  );
}
