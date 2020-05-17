import React, { useMemo } from "react";
import { useSettings } from "../../store/settings/settingsStore";
import { useReplays } from "../../store/replays";
import {
  Button,
  Typography,
  Card,
  createStyles,
  Theme,
  makeStyles,
  CardContent,
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Table,
  CircularProgress,
} from "@material-ui/core";
import fs from "fs";

const getReplayFiles = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });
};

export default function ImportScreen(props: any) {
  const [settingsState] = useSettings();
  const [state, actions] = useReplays();
  useMemo(() => actions.findReplays(settingsState.replaysFolder), [
    settingsState.replaysFolder,
  ]);
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5">Import</Typography>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>File</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Imported</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.replays &&
              state.replays.map((r) => {
                const importClick = () => {
                  actions.importReplay(r);
                };
                const importButton = !r.importing ? (
                  <Button size="small" color="primary" onClick={importClick}>
                    {r.imported ? "Re-import" : "Import"}
                  </Button>
                ) : (
                  <CircularProgress size={24} />
                );
                return (
                  <TableRow key={r.name}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.imported ? "Yes" : "No"}</TableCell>
                    <TableCell>{importButton}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
