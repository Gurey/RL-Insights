import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { HashRouter as Router, Link, Switch, Route } from "react-router-dom";
import Me from "../screens/me";
import ImportScreen from "../screens/import";
import MyTeam from "../screens/my-team";
import { Settings } from "../screens/settings";
import Sessions from "../screens/sessions";
import ViewGame from "../screens/view-game";
import { useSettings } from "../store/settings/settingsStore";
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

export default function ClippedDrawer() {
  const classes = useStyles();
  const [settingsState] = useSettings();

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar>RL Insigts</Toolbar>
          <div className={classes.drawerContainer}>
            <List>
              <ListItem
                component={Link}
                to={`/me/${settingsState.playerId}`}
                button
                key={"Me"}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Me" />
              </ListItem>
              {["Sessions", "My Teams", "Import"].map((text, index) => (
                <ListItem
                  component={Link}
                  to={"/" + text.replace(" ", "")}
                  button
                  key={text}
                >
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {["Settings"].map((text, index) => (
                <ListItem component={Link} to={text} button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
        <main className={classes.content}>
          <Switch>
            <Route
              path="/Me/:playerId"
              render={(props) => <Me {...props} />}
            ></Route>
            <Route
              path="/MyTeams"
              render={(props) => <MyTeam {...props} />}
            ></Route>
            <Route
              path="/Import"
              render={(props) => <ImportScreen {...props} />}
            ></Route>
            <Route
              path="/Settings"
              render={(props) => <Settings {...props} />}
            ></Route>
            <Route
              path="/ViewGame/:gameId"
              render={(props) => <ViewGame {...props} />}
            ></Route>
            <Route path="/" render={(props) => <Sessions {...props} />}></Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
