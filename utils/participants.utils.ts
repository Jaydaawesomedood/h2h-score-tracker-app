import { Player, Team } from "@/models/Player";

function FilterParticipantsByProperty(filters: { [key: string]: string }, participants: { players: Player[], teams: Team[] }) {
  // property = "name", filter by player name / team name
  if (filters["name"] && filters["name"] !== "") {
    let filteredPlayers: Player[] = [];
    let filteredTeams: Team[] = [];

    for (let i = 0; i < participants.players.length; i++) {
      const player = participants.players[i];

      if (
        player.firstName.toLowerCase().includes(filters["name"].toLowerCase()) ||
        player.lastName.toLowerCase().includes(filters["name"].toLowerCase())
      ) {
        filteredPlayers.push(player);
      }
    };

    for (let i = 0; i < participants.teams.length; i++) {
      const team = participants.teams[i];

      if (
        team.name.toLowerCase().includes(filters["name"].toLowerCase()) ||
        team.players[0].firstName.toLowerCase().includes(filters["name"].toLowerCase()) ||
        team.players[0].lastName.toLowerCase().includes(filters["name"].toLowerCase()) ||
        team.players[1].firstName.toLowerCase().includes(filters["name"].toLowerCase()) ||
        team.players[1].lastName.toLowerCase().includes(filters["name"].toLowerCase())
      ) {
        filteredTeams.push(team);
      }
    }

    return { players: filteredPlayers, teams: filteredTeams };
  }

  if (filters["type"]) {
    if (filters["type"] === "players") {
      let filteredPlayers: Player[] = [];

      if (filters["gender"]) {
        if (filters["gender"] === "all") {
          filteredPlayers = [...participants.players];
        }
        else {
          for (let i = 0; i < participants.players.length; i++) {
            const player = participants.players[i];
            if (player.gender.toLowerCase() === filters["gender"]) filteredPlayers.push(player);
          }
        }
      } 

      return { players: filteredPlayers, teams: [] };
    }
    else if (filters["type"] === "teams") {
      let filteredTeams: Team[] = [];

      if (filters["teamCategory"]) {
        if (filters["teamCategory"] === "all") {
          filteredTeams = [...participants.teams];
        }
        else {
          for (let i = 0; i < participants.teams.length; i++) {
            const team = participants.teams[i];
            if (team.category.toLowerCase() === filters["teamCategory"]) filteredTeams.push(team);
          }
        }
      } 

      return { players: [], teams: filteredTeams };
    }
  }

  return participants;
};

export {
  FilterParticipantsByProperty,
};