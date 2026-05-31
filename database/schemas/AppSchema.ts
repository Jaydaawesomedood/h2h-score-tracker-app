import { appSchema } from "@nozbe/watermelondb";
import { PlayerSchema } from "./PlayerSchema";
import { MatchSchema } from "./MatchSchema";
import { MatchPlayerSchema } from "./MatchPlayerSchema";

export default appSchema({
  version: 2,
  tables: [
    PlayerSchema,
    MatchSchema,
    MatchPlayerSchema,
  ]
});