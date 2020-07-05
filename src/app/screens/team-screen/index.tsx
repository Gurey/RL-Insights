import React, { useEffect, useState } from "react";
import { useReplays } from "../../store/replays";
import { useParams } from "react-router-dom";
import { Session } from "../../components/session";
import {
  AppBar,
  Tabs,
  Tab,
  makeStyles,
  createStyles,
  CircularProgress,
} from "@material-ui/core";
import { TabPanel } from "../../components/tabpanel";
import { TeamStatsTable } from "./TeamStatsTable";
import { useSettings } from "../../store/settings/settingsStore";

const useStyle = makeStyles((theme) =>
  createStyles({
    tab: {
      margin: "-24px",
      marginBottom: theme.spacing(3),
      width: "auto",
      backgroundColor: theme.palette.background.paper,
    },
    statTableContainer: {
      marginBottom: theme.spacing(3),
    },
  }),
);

export default function TeamScreen(props: any) {
  const { teamId, playlist } = useParams();
  const [replaysState, replaysActions] = useReplays();
  const [settingsState, _] = useSettings();
  const [tabIndex, setTabIndex] = useState(0);
  const classes = useStyle();
  useEffect(() => {
    replaysActions.loadGameSessions(playlist, teamId);
    replaysActions.loadTeamStats(settingsState.playerId, playlist, teamId);
  }, []);
  const onTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };
  if (!replaysState.teamAnalysisData.stats) {
    return <CircularProgress />;
  }
  const {
    centerOfMass,
    hitCounts,
    possession,
  } = replaysState.teamAnalysisData.stats;
  const { positionalTendencies, ...centerOfMassData } = centerOfMass;
  const {
    centerOfMass: centerOfMassCorr,
    hitCounts: hitCountsCorr,
    possession: possessionCorr,
  } = replaysState.teamAnalysisData.goalDiffCorr;
  const {
    positionalTendencies: positionalTendenciesCorr,
    ...centerOfMassDataCorr
  } = centerOfMassCorr;
  return (
    <div>
      <AppBar className={classes.tab} position="relative" color="default">
        <Tabs
          value={tabIndex}
          onChange={onTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Sessions" />
          <Tab label="Stats" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        {replaysState.sessions.map((sess, index) => (
          <Session key={sess.from} session={sess} expanded={index === 0} />
        ))}
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <div className={classes.statTableContainer}>
          <TeamStatsTable
            stats={hitCounts}
            correlations={hitCountsCorr}
            name="Hit Counts"
          />
        </div>
        <div className={classes.statTableContainer}>
          <TeamStatsTable
            stats={possession}
            correlations={possessionCorr}
            name="Possession"
          />
        </div>
        <div className={classes.statTableContainer}>
          <TeamStatsTable
            stats={centerOfMassData}
            correlations={centerOfMassCorr}
            name="Center of Mass"
          />
        </div>
        <div className={classes.statTableContainer}>
          <TeamStatsTable
            stats={positionalTendencies}
            correlations={positionalTendenciesCorr}
            name="Center of Mass"
          />
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}></TabPanel>
    </div>
  );
}
