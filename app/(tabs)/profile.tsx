import { ThemedText } from "@/components/ThemedText";
import { useContext } from "react";
import { Button, Dimensions, View } from "react-native";
import { DbContext } from "../_layout";
import { GetAllDoublesMatches, GetAllTeams } from "@/utils/database/database";
import * as FileSystem from 'expo-file-system';

export default function ProfileScreen() {
  // const db = useSQLiteContext();
  const db = useContext(DbContext);
  
  async function createDB() {
    await db?.execAsync(`
      PRAGMA foreign_keys=ON;

      CREATE TABLE IF NOT EXISTS players (id VARCHAR(255) PRIMARY KEY NOT NULL, firstName VARCHAR(255), lastName VARCHAR(255) NOT NULL, lastNameFirst BIT DEFAULT 0, gender VARCHAR(255));
      INSERT INTO players (id, firstName, lastName, lastNameFirst, gender)
      VALUES
      ('p1', 'Jason', 'Choo', 0, 'male'),
      ('p2', 'Bryan', 'Kee', 0, 'male'),
      ('p3', 'Nyook Ann', 'Thong', 1, 'female'),
      ('p4', 'Nurul Syfiqah', 'Ishak', 0, 'female'),
      ('p5', 'Desmond', 'Darviinsamy', 0, 'male'),
      ('p6', 'Ben Shern', 'Chua', 1, 'male'),
      ('p7', 'Zhong Ming', 'Tan', 1, 'male'),
      ('p8', 'Haney', 'Iskandar', 0, 'female'),
      ('p9', 'Mohammad Hasif', 'Rozak', 0, 'male');

      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        name VARCHAR(255),
        category VARCHAR(20) NOT NULL,
        player1ID VARCHAR(10) NOT NULL,
        player2ID VARCHAR(10) NOT NULL,
        FOREIGN KEY(player1ID) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY(player2ID) REFERENCES players(id) ON DELETE CASCADE
      );
      INSERT INTO teams (id, name, category, player1ID, player2ID)
      VALUES
      ('t1', '', 'md', 'p1', 'p2'),
      ('t2', '', 'wd', 'p4', 'p8'),
      ('t3', 'Vulnerability Hunters', 'md', 'p5', 'p9'),
      ('t4', '', 'xd', 'p1', 'p8'),
      ('t5', '', 'xd', 'p2', 'p3');

      CREATE TABLE IF NOT EXISTS tournaments (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        startDate TEXT(65535) NOT NULL,
        endDate TEXT(65535) NOT NULL,
        venue TEXT(65535) NOT NULL
      );

      INSERT INTO tournaments (id, name, startDate, endDate, venue)
      VALUES
      ('c1', 'Dell Cyberlympics 2023', '26-08-2023', '26-08-2023', 'KSL Sports Puchong'),
      ('c2', 'Dell Cyberleague 2024 - Season 1', '08-06-2024', '08-06-2024', 'Badminton Hall ILSAS, Bangi'),
      ('c3', 'Dell Cyberleague 2024 - Season 2', '17-08-2024', '18-08-2024', 'Kompleks Kejiranan Presint 11, Putrajaya'),
      ('c4', 'Dell Cyberleague 2024 - Season 3', '12-10-2024', '13-10-2024', 'Puchong Sports Center');

      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        matchId VARCHAR(255) NOT NULL
      );

      INSERT INTO matches (id, matchId)
      VALUES
      ('m1', 'sm1'),
      ('m2', 'dm1'),
      ('m3', 'sm2'),
      ('m4', 'sm3');

      CREATE TABLE IF NOT EXISTS singlesMatches (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        category VARCHAR(20) NOT NULL,
        participant1ID VARCHAR(10) NOT NULL,
        participant2ID VARCHAR(10) NOT NULL,
        score TEXT(65535) NOT NULL,
        datetime TEXT(65535) NOT NULL,
        mode VARCHAR(20) NOT NULL,
        tournamentID VARCHAR(30) NULL,
        FOREIGN KEY(participant1ID) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY(participant2ID) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY(tournamentID) REFERENCES tournaments(id)
      );
      INSERT INTO singlesMatches (id, category, participant1ID, participant2ID, score, datetime, mode, tournamentID)
      VALUES
      ('sm1', 'ms', 'p1', 'p2', '13-21,15-21', '02-10-2024', 'casual', NULL),
      ('sm2', 'ms', 'p1', 'p2', '21-10,19-21,21-10', '02-10-2024', 'casual', NULL),
      ('sm3', 'ms', 'p1', 'p2', '21-17,21-10', '02-10-2024', 'casual', NULL);

      CREATE TABLE IF NOT EXISTS doublesMatches (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        category VARCHAR(20) NOT NULL,
        participant1ID VARCHAR(10) NOT NULL,
        participant2ID VARCHAR(10) NOT NULL,
        score TEXT(65535) NOT NULL,
        datetime TEXT(65535) NOT NULL,
        mode VARCHAR(20) NOT NULL,
        tournamentID VARCHAR(30) NULL,
        FOREIGN KEY(participant1ID) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY(participant2ID) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY(tournamentID) REFERENCES tournaments(id)
      );
      INSERT INTO doublesMatches (id, category, participant1ID, participant2ID, score, datetime, mode, tournamentID)
      VALUES
      ('dm1', 'xd', 't4', 't5', '21-23,21-17,21-10', '26-09-2024', 'casual', NULL);
    `);
  }
  
  async function getData() {
    // const allRows = await GetAllTeams(db!);
    // allRows.map((row) => { row.players.forEach(player => console.log(player))})
    const allRows = await GetAllDoublesMatches(db!);
    // allRows.map((row: any[]) => { row.forEach(match => console.log(match))})
    allRows.forEach((row: any) => {row.teams.forEach((team: any) => console.log(team.players))});
    // console.log(allRows);
  }

  async function deleteTable() {
    await db?.execAsync(`
      DROP TABLE IF EXISTS doublesMatches;
      DROP TABLE IF EXISTS singlesMatches;
      DROP TABLE IF EXISTS matches;
      DROP TABLE IF EXISTS tournaments;
      DROP TABLE IF EXISTS teams;
      DROP TABLE IF EXISTS players;
    `);
  }

  return (
    <View style={{padding: 32}}>
      <ThemedText>{Dimensions.get('window').width}</ThemedText>
      <ThemedText>{Dimensions.get('window').height}</ThemedText>
      <ThemedText>{FileSystem.documentDirectory}</ThemedText>
      <Button onPress={createDB} title="Create DB" />
      <View style={{ marginVertical: 8 }}/>
      <Button onPress={getData} title="Get Data" />
      <View style={{ marginVertical: 8 }}/>
      <Button onPress={deleteTable} title="Delete Table" color={"red"} />
    </View>
  );
}